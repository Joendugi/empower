data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  name = "${var.project_name}-${var.environment}"
  azs  = slice(data.aws_availability_zones.available.names, 0, 3)
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
  is_production = var.environment == "production"
}

# Three tiers per AZ: public (ALB, NAT), private (Kubernetes nodes), database (RDS, Redis).
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.7"

  name = local.name
  cidr = var.vpc_cidr
  azs  = local.azs

  public_subnets   = [for i, _ in local.azs : cidrsubnet(var.vpc_cidr, 8, i)]
  private_subnets  = [for i, _ in local.azs : cidrsubnet(var.vpc_cidr, 4, i + 1)]
  database_subnets = [for i, _ in local.azs : cidrsubnet(var.vpc_cidr, 8, i + 100)]

  create_database_subnet_group = true

  enable_nat_gateway = true
  # One NAT gateway outside production saves about $35 a month per AZ.
  single_nat_gateway     = !local.is_production
  one_nat_gateway_per_az = local.is_production

  enable_dns_hostnames = true
  enable_dns_support   = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
}

# S3 traffic from the nodes (uploads, image layers) skips the NAT gateway, which bills per GB.
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = module.vpc.private_route_table_ids
}
