output "s3_assets_bucket" {
  description = "Name of the S3 assets bucket"
  value       = aws_s3_bucket.assets.bucket
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC. Set as GitHub secret AWS_ROLE_ARN."
  value       = aws_iam_role.github_actions.arn
}

# Uncomment as modules are enabled:

# output "eks_cluster_endpoint" {
#   description = "EKS cluster API endpoint"
#   value       = module.eks.cluster_endpoint
#   sensitive   = true
# }

# output "eks_cluster_name" {
#   description = "EKS cluster name"
#   value       = module.eks.cluster_name
# }

# output "rds_endpoint" {
#   description = "RDS PostgreSQL endpoint"
#   value       = module.rds.db_instance_endpoint
#   sensitive   = true
# }

# output "redis_endpoint" {
#   description = "ElastiCache Redis endpoint"
#   value       = aws_elasticache_cluster.redis.cache_nodes[0].address
#   sensitive   = true
# }
