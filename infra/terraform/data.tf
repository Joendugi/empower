###############################################################################
# Postgres (RDS) and Redis (ElastiCache). Both live in the database subnets
# and accept connections only from the Kubernetes nodes.
###############################################################################

# --- Postgres ------------------------------------------------------------------

resource "aws_security_group" "db" {
  name        = "${local.name}-db"
  description = "Postgres from EKS nodes"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "db_from_nodes" {
  security_group_id            = aws_security_group.db.id
  referenced_security_group_id = module.eks.node_security_group_id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}

resource "aws_db_parameter_group" "postgres" {
  name   = "${local.name}-pg16"
  family = "postgres16"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }
  # Log anything slower than half a second.
  parameter {
    name  = "log_min_duration_statement"
    value = "500"
  }
}

resource "aws_db_instance" "postgres" {
  identifier     = local.name
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class

  db_name  = "cyberlearn"
  username = "cyberlearn"
  password = random_password.db.result
  port     = 5432

  allocated_storage     = var.db_allocated_storage_gb
  max_allocated_storage = var.db_max_allocated_storage_gb
  storage_type          = "gp3"
  storage_encrypted     = true

  multi_az               = var.db_multi_az
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.db.id]
  parameter_group_name   = aws_db_parameter_group.postgres.name
  publicly_accessible    = false

  backup_retention_period    = var.db_backup_retention_days
  backup_window              = "00:00-01:00" # 03:00-04:00 EAT, after the evening peak
  maintenance_window         = "sun:01:30-sun:02:30"
  auto_minor_version_upgrade = true
  copy_tags_to_snapshot      = true

  performance_insights_enabled = true
  monitoring_interval          = 60
  monitoring_role_arn          = aws_iam_role.rds_monitoring.arn

  deletion_protection       = local.is_production
  skip_final_snapshot       = !local.is_production
  final_snapshot_identifier = local.is_production ? "${local.name}-final" : null
  apply_immediately         = !local.is_production
}

resource "aws_iam_role" "rds_monitoring" {
  name = "${local.name}-rds-monitoring"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRole"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# --- Redis: cache, rate limits, leaderboards, Celery queue -----------------------

resource "aws_security_group" "redis" {
  name        = "${local.name}-redis"
  description = "Redis from EKS nodes"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "redis_from_nodes" {
  security_group_id            = aws_security_group.redis.id
  referenced_security_group_id = module.eks.node_security_group_id
  ip_protocol                  = "tcp"
  from_port                    = 6379
  to_port                      = 6379
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = local.name
  subnet_ids = module.vpc.database_subnets
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = local.name
  description          = "CyberLearn ${var.environment} cache and Celery broker"

  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.redis_node_type
  parameter_group_name = "default.redis7"
  port                 = 6379

  num_cache_clusters         = 1 + var.redis_replicas
  automatic_failover_enabled = var.redis_replicas > 0
  multi_az_enabled           = var.redis_replicas > 0

  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_password.redis.result

  snapshot_retention_limit = local.is_production ? 3 : 0
  snapshot_window          = "01:00-02:00"
  maintenance_window       = "sun:02:30-sun:03:30"
  apply_immediately        = !local.is_production
}
