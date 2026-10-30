output "app_url" {
  value = "https://${var.app_hostname}"
}

output "github_deploy_role_arn" {
  description = "Set as the AWS_DEPLOY_ROLE_ARN secret of the matching GitHub environment."
  value       = aws_iam_role.github_deploy.arn
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "kubeconfig_command" {
  value = "aws eks update-kubeconfig --name ${module.eks.cluster_name} --region ${var.aws_region}"
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "web_bucket" {
  value = module.web_bucket.id
}

output "media_bucket" {
  value = module.media_bucket.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.app.id
}

output "secrets" {
  description = "Secrets Manager names. Add third-party keys to `external`."
  value = {
    generated = aws_secretsmanager_secret.api_generated.name
    external  = aws_secretsmanager_secret.api_external.name
  }
}

output "admin_staff_key" {
  description = "Office staff key. The PWA build needs its hash as VITE_ADMIN_STAFF_HASH (see infra/README.md)."
  value       = random_password.admin_staff_key.result
  sensitive   = true
}
