variable "aws_region" {
  description = "Region for state, ECR and the environments. af-south-1 (Cape Town) is AWS's only Africa region."
  type        = string
  default     = "af-south-1"
}

variable "project_name" {
  description = "Prefix for resource names"
  type        = string
  default     = "cyberlearn"
}

variable "state_bucket_name" {
  description = "Terraform state bucket. Empty = <project>-tfstate-<account id>."
  type        = string
  default     = ""
}

variable "github_org" {
  description = "GitHub user or organisation that owns the repository"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name, without the owner"
  type        = string
}
