locals {
  app_namespace = "cyberlearn"
  app_sa        = "cyberlearn-api"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.29"

  name               = local.name
  kubernetes_version = var.kubernetes_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # GitHub-hosted runners deploy from the internet; nodes reach the API privately.
  endpoint_public_access       = true
  endpoint_public_access_cidrs = var.cluster_endpoint_public_access_cidrs
  endpoint_private_access      = true

  authentication_mode                      = "API"
  enable_cluster_creator_admin_permissions = true
  deletion_protection                      = local.is_production

  enabled_log_types                      = ["api", "audit", "authenticator"]
  cloudwatch_log_group_retention_in_days = local.is_production ? 90 : 14

  addons = {
    vpc-cni = {
      before_compute = true
    }
    eks-pod-identity-agent = {
      before_compute = true
    }
    kube-proxy = {}
    coredns    = {}
    # Container Insights metrics plus container logs in CloudWatch.
    amazon-cloudwatch-observability = {
      pod_identity_association = [{
        role_arn        = module.cloudwatch_pod_identity.iam_role_arn
        service_account = "cloudwatch-agent"
      }]
    }
  }

  eks_managed_node_groups = {
    general = {
      ami_type       = "AL2023_x86_64_STANDARD"
      instance_types = var.node_instance_types
      capacity_type  = "ON_DEMAND"
      min_size       = var.node_min_size
      max_size       = var.node_max_size
      desired_size   = var.node_desired_size

      # Cluster Autoscaler finds the group by these tags.
      tags = {
        "k8s.io/cluster-autoscaler/enabled"       = "true"
        "k8s.io/cluster-autoscaler/${local.name}" = "owned"
      }
    }
  }

  access_entries = {
    # CI may manage only the app namespace (Helm releases, ExternalSecrets, TargetGroupBindings).
    github_deploy = {
      principal_arn = aws_iam_role.github_deploy.arn
      policy_associations = {
        app_admin = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSAdminPolicy"
          access_scope = {
            type       = "namespace"
            namespaces = [local.app_namespace]
          }
        }
      }
    }
  }

  node_security_group_additional_rules = {
    alb_to_api = {
      description              = "ALB to API pods"
      protocol                 = "tcp"
      from_port                = 8000
      to_port                  = 8000
      type                     = "ingress"
      source_security_group_id = aws_security_group.alb.id
    }
  }
}
