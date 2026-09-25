variable "aws_region" {
  description = "AWS region to deploy into. af-south-1 (Cape Town) is the nearest Africa region."
  type        = string
  default     = "af-south-1"
}

variable "environment" {
  description = "Deployment environment: development | staging | production"
  type        = string
  default     = "staging"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "environment must be development, staging, or production"
  }
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "cyberlearn"
}

variable "db_instance_class" {
  description = "RDS instance class. Use db.t3.medium for staging, db.m6g.large for production."
  type        = string
  default     = "db.t3.medium"
}

variable "eks_node_count" {
  description = "Initial number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "eks_node_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "github_org" {
  description = "GitHub organization or user that may assume the deploy role via OIDC"
  type        = string
  default     = "cyberlearn-ke"
}

variable "github_repo" {
  description = "GitHub repository name (without org) allowed to assume the deploy role"
  type        = string
  default     = "cyberlearn"
}
