environment = "production"

github_org  = "Joendugi"
github_repo = "empower"

hosted_zone_name = "cyberlearn.ke"
app_hostname     = "cyberlearn.ke"

vpc_cidr = "10.50.0.0/16"

node_instance_types = ["m6i.large"]
node_min_size       = 3
node_max_size       = 10
node_desired_size   = 3

db_instance_class           = "db.m7g.large"
db_multi_az                 = true
db_backup_retention_days    = 14
db_allocated_storage_gb     = 100
db_max_allocated_storage_gb = 1000

redis_node_type = "cache.m7g.large"
redis_replicas  = 1
