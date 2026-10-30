environment = "staging"

github_org  = "Joendugi"
github_repo = "empower"

hosted_zone_name = "cyberlearn.ke"
app_hostname     = "staging.cyberlearn.ke"

node_instance_types = ["t3.large"]
node_min_size       = 2
node_max_size       = 4
node_desired_size   = 2

db_instance_class        = "db.t4g.medium"
db_multi_az              = false
db_backup_retention_days = 7

redis_node_type = "cache.t4g.small"
redis_replicas  = 0
