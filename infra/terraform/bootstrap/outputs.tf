output "state_bucket" {
  description = "Put this in envs/<env>.backend.hcl as `bucket`."
  value       = aws_s3_bucket.state.bucket
}

output "github_oidc_provider_arn" {
  value = aws_iam_openid_connect_provider.github.arn
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "build_role_arn" {
  description = "Set as the GitHub repository secret AWS_BUILD_ROLE_ARN."
  value       = aws_iam_role.build.arn
}
