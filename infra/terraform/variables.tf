variable "aws_region" {
  description = "af-south-1 (Cape Town) is AWS's only Africa region; CloudFront serves Kenya from its Nairobi edge."
  type        = string
  default     = "af-south-1"
}

variable "project_name" {
  type    = string
  default = "cyberlearn"
}

variable "environment" {
  description = "staging | production"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be staging or production"
  }
}

# --- GitHub ------------------------------------------------------------------

variable "github_org" {
  type = string
}

variable "github_repo" {
  type = string
}

# --- DNS -----------------------------------------------------------------------

variable "hosted_zone_name" {
  description = "Existing Route 53 public hosted zone, e.g. cyberlearn.ke"
  type        = string
}

variable "app_hostname" {
  description = "Where learners open the app, e.g. staging.cyberlearn.ke or cyberlearn.ke"
  type        = string
}

# --- Network -------------------------------------------------------------------

variable "vpc_cidr" {
  type    = string
  default = "10.40.0.0/16"
}

# --- Kubernetes ----------------------------------------------------------------

variable "kubernetes_version" {
  description = "EKS minor version. 1.35 has standard support until March 2027."
  type        = string
  default     = "1.35"
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "Who may reach the Kubernetes API. GitHub-hosted runners need it public; narrow it if you use self-hosted runners."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "node_instance_types" {
  type    = list(string)
  default = ["t3.large"]
}

variable "node_min_size" {
  type    = number
  default = 2
}

variable "node_max_size" {
  type    = number
  default = 6
}

variable "node_desired_size" {
  type    = number
  default = 2
}

# --- Data ----------------------------------------------------------------------

variable "db_instance_class" {
  type    = string
  default = "db.t4g.medium"
}

variable "db_allocated_storage_gb" {
  type    = number
  default = 50
}

variable "db_max_allocated_storage_gb" {
  description = "Storage autoscaling ceiling"
  type        = number
  default     = 500
}

variable "db_multi_az" {
  type    = bool
  default = false
}

variable "db_backup_retention_days" {
  type    = number
  default = 7
}

variable "redis_node_type" {
  type    = string
  default = "cache.t4g.small"
}

variable "redis_replicas" {
  description = "Read replicas besides the primary. 1+ enables automatic failover across AZs."
  type        = number
  default     = 0
}

# --- Add-on chart versions (checked October 2026) ------------------------------

variable "chart_versions" {
  type = object({
    aws_load_balancer_controller = string
    external_secrets             = string
    metrics_server               = string
    cluster_autoscaler           = string
  })
  default = {
    aws_load_balancer_controller = "3.6.2"
    external_secrets             = "2.14.0"
    metrics_server               = "3.14.0"
    cluster_autoscaler           = "9.59.0"
  }
}
