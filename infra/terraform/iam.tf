###############################################################################
# Who may do what:
#   - API pods: read/write the uploads bucket (Pod Identity)
#   - GitHub deploy role: only from this repo's "<environment>" GitHub
#     environment; deploys the Helm release and the PWA files
###############################################################################

data "aws_caller_identity" "current" {}

data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com" # created by bootstrap/
}

# --- API pods --------------------------------------------------------------------

module "api_pod_identity" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "~> 2.10"

  name = "${local.name}-api"

  attach_custom_policy = true
  policy_statements = [
    {
      sid       = "Uploads"
      actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
      resources = ["${module.uploads_bucket.arn}/*"]
    },
    {
      sid       = "UploadsList"
      actions   = ["s3:ListBucket"]
      resources = [module.uploads_bucket.arn]
    },
  ]

  associations = {
    this = {
      cluster_name    = module.eks.cluster_name
      namespace       = local.app_namespace
      service_account = local.app_sa
    }
  }
}

# --- GitHub Actions deploy role ----------------------------------------------------

data "aws_iam_policy_document" "github_deploy_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    # Only jobs that run in the matching GitHub environment, so production
    # deploys go through that environment's protection rules (required reviewers).
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:environment:${var.environment}"]
    }
  }
}

resource "aws_iam_role" "github_deploy" {
  name               = "${local.name}-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_deploy_assume.json
}

data "aws_iam_policy_document" "github_deploy" {
  statement {
    sid       = "Kubeconfig"
    actions   = ["eks:DescribeCluster"]
    resources = [module.eks.cluster_arn]
  }
  statement {
    sid       = "DeployConfig"
    actions   = ["ssm:GetParameter"]
    resources = [aws_ssm_parameter.helm_values.arn, aws_ssm_parameter.deploy.arn]
  }
  statement {
    sid       = "WebBucketList"
    actions   = ["s3:ListBucket"]
    resources = [module.web_bucket.arn]
  }
  statement {
    sid       = "WebBucketWrite"
    actions   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
    resources = ["${module.web_bucket.arn}/*"]
  }
  statement {
    sid       = "Invalidate"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = [aws_cloudfront_distribution.app.arn]
  }
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "deploy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}

# --- What the deploy workflow needs, published so nobody copies outputs by hand ---

data "aws_ecr_repository" "api" {
  name = "${var.project_name}/api" # created by bootstrap/
}

resource "aws_ssm_parameter" "helm_values" {
  name = "/${var.project_name}/${var.environment}/helm-values"
  type = "String"
  value = yamlencode({
    image = {
      repository = data.aws_ecr_repository.api.repository_url
    }
    serviceAccount = {
      name = local.app_sa
    }
    secrets = {
      generated = aws_secretsmanager_secret.api_generated.name
      external  = aws_secretsmanager_secret.api_external.name
    }
    targetGroupBinding = {
      targetGroupARN = aws_lb_target_group.api.arn
    }
    config = {
      AWS_REGION     = var.aws_region
      UPLOADS_BUCKET = module.uploads_bucket.id
      PUBLIC_HOST    = var.app_hostname
      PUBLIC_APP_URL = "https://${var.app_hostname}"
      CORS_ORIGINS   = "https://${var.app_hostname}"
      TRUSTED_HOSTS  = "${var.app_hostname},${local.api_origin_host}"
    }
  })
}

resource "aws_ssm_parameter" "deploy" {
  name = "/${var.project_name}/${var.environment}/deploy"
  type = "String"
  value = jsonencode({
    clusterName    = module.eks.cluster_name
    namespace      = local.app_namespace
    webBucket      = module.web_bucket.id
    distributionId = aws_cloudfront_distribution.app.id
    appUrl         = "https://${var.app_hostname}"
    mediaUrl       = "https://${var.app_hostname}/media"
  })
}
