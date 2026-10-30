###############################################################################
# Cluster add-ons. Each gets an AWS role through EKS Pod Identity, scoped to
# what it needs in this environment.
###############################################################################

module "lb_controller_pod_identity" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "~> 2.10"

  name = "${local.name}-lb-controller"

  # Terraform owns the ALB; the controller only registers pod IPs in its target group.
  attach_aws_lb_controller_targetgroup_binding_only_policy = true
  aws_lb_controller_targetgroup_arns                       = [aws_lb_target_group.api.arn]

  associations = {
    this = {
      cluster_name    = module.eks.cluster_name
      namespace       = "kube-system"
      service_account = "aws-load-balancer-controller"
    }
  }
}

module "external_secrets_pod_identity" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "~> 2.10"

  name = "${local.name}-external-secrets"

  attach_external_secrets_policy        = true
  external_secrets_secrets_manager_arns = [aws_secretsmanager_secret.api_generated.arn, aws_secretsmanager_secret.api_external.arn]
  external_secrets_create_permission    = false

  associations = {
    this = {
      cluster_name    = module.eks.cluster_name
      namespace       = "external-secrets"
      service_account = "external-secrets"
    }
  }
}

module "cluster_autoscaler_pod_identity" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "~> 2.10"

  name = "${local.name}-cluster-autoscaler"

  attach_cluster_autoscaler_policy = true
  cluster_autoscaler_cluster_names = [module.eks.cluster_name]

  associations = {
    this = {
      cluster_name    = module.eks.cluster_name
      namespace       = "kube-system"
      service_account = "cluster-autoscaler"
    }
  }
}

# Created before the cluster add-on so the agent starts with credentials.
module "cloudwatch_pod_identity" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "~> 2.10"

  name = "${local.name}-cloudwatch"

  attach_aws_cloudwatch_observability_policy = true
}

resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = var.chart_versions.aws_load_balancer_controller
  namespace  = "kube-system"

  values = [yamlencode({
    clusterName = module.eks.cluster_name
    region      = var.aws_region
    vpcId       = module.vpc.vpc_id
    serviceAccount = {
      name = "aws-load-balancer-controller"
    }
    # Only TargetGroupBindings are used; don't let Services or Ingresses create load balancers.
    enableServiceMutatorWebhook = false
  })]

  depends_on = [module.lb_controller_pod_identity]
}

resource "helm_release" "external_secrets" {
  name             = "external-secrets"
  repository       = "https://charts.external-secrets.io"
  chart            = "external-secrets"
  version          = var.chart_versions.external_secrets
  namespace        = "external-secrets"
  create_namespace = true

  values = [yamlencode({
    serviceAccount = {
      name = "external-secrets"
    }
  })]

  depends_on = [module.external_secrets_pod_identity]
}

resource "helm_release" "metrics_server" {
  name       = "metrics-server"
  repository = "https://kubernetes-sigs.github.io/metrics-server/"
  chart      = "metrics-server"
  version    = var.chart_versions.metrics_server
  namespace  = "kube-system"
}

resource "helm_release" "cluster_autoscaler" {
  name       = "cluster-autoscaler"
  repository = "https://kubernetes.github.io/autoscaler"
  chart      = "cluster-autoscaler"
  version    = var.chart_versions.cluster_autoscaler
  namespace  = "kube-system"

  values = [yamlencode({
    awsRegion = var.aws_region
    autoDiscovery = {
      clusterName = module.eks.cluster_name
    }
    rbac = {
      serviceAccount = {
        name = "cluster-autoscaler"
      }
    }
    extraArgs = {
      balance-similar-node-groups = true
      skip-nodes-with-system-pods = false
    }
  })]

  depends_on = [module.cluster_autoscaler_pod_identity]
}

# The app namespace, plus RBAC the AWS charts don't ship: lets namespace admins
# (the CI deploy role) manage TargetGroupBindings.
resource "helm_release" "cluster_config" {
  name      = "cluster-config"
  chart     = "${path.module}/../helm/cluster-config"
  namespace = "kube-system"

  values = [yamlencode({
    appNamespace = local.app_namespace
  })]

  depends_on = [helm_release.aws_load_balancer_controller, helm_release.external_secrets]
}
