###############################################################################
# Edge: one CloudFront distribution on the app hostname.
#
#   /*        -> S3 web bucket (the PWA), cached at the edge
#   /media/*  -> S3 media bucket, cached at the edge
#   /api/*    -> ALB -> API pods, never cached
#
# Keeping the API on the same hostname as the app means no CORS and the
# session cookie stays first-party. The ALB accepts only CloudFront's IP
# ranges, and only requests carrying the secret X-Origin-Verify header.
###############################################################################

data "aws_route53_zone" "main" {
  name         = var.hosted_zone_name
  private_zone = false
}

locals {
  api_origin_host = "api-origin.${var.app_hostname}"
}

# --- Certificates --------------------------------------------------------------

resource "aws_acm_certificate" "app" {
  provider          = aws.us_east_1
  domain_name       = var.app_hostname
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "api_origin" {
  domain_name       = local.api_origin_host
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  certificate_validation_records = merge(
    { for o in aws_acm_certificate.app.domain_validation_options : "app-${o.domain_name}" => o },
    { for o in aws_acm_certificate.api_origin.domain_validation_options : "api-${o.domain_name}" => o },
  )
}

resource "aws_route53_record" "certificate_validation" {
  for_each = local.certificate_validation_records

  zone_id         = data.aws_route53_zone.main.zone_id
  name            = each.value.resource_record_name
  type            = each.value.resource_record_type
  records         = [each.value.resource_record_value]
  ttl             = 300
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "app" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.app.arn
  validation_record_fqdns = [for k, r in aws_route53_record.certificate_validation : r.fqdn if startswith(k, "app-")]
}

resource "aws_acm_certificate_validation" "api_origin" {
  certificate_arn         = aws_acm_certificate.api_origin.arn
  validation_record_fqdns = [for k, r in aws_route53_record.certificate_validation : r.fqdn if startswith(k, "api-")]
}

# --- Load balancer -------------------------------------------------------------

data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

resource "aws_security_group" "alb" {
  name        = "${local.name}-alb"
  description = "HTTPS from CloudFront only"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "alb_from_cloudfront" {
  security_group_id = aws_security_group.alb.id
  prefix_list_id    = data.aws_ec2_managed_prefix_list.cloudfront.id
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_vpc_security_group_egress_rule" "alb_to_pods" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = var.vpc_cidr
  ip_protocol       = "tcp"
  from_port         = 8000
  to_port           = 8000
}

resource "aws_lb" "api" {
  name               = "${local.name}-api"
  load_balancer_type = "application"
  internal           = false
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.alb.id]

  drop_invalid_header_fields = true
  idle_timeout               = 60
  enable_deletion_protection = local.is_production
}

# Pods are registered by the TargetGroupBinding in the Helm chart.
resource "aws_lb_target_group" "api" {
  name                 = "${local.name}-api"
  target_type          = "ip"
  port                 = 8000
  protocol             = "HTTP"
  vpc_id               = module.vpc.vpc_id
  deregistration_delay = 30

  health_check {
    path                = "/ready"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.api.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.api_origin.certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "application/json"
      message_body = "{\"detail\":\"Forbidden\"}"
      status_code  = "403"
    }
  }
}

resource "aws_lb_listener_rule" "from_cloudfront" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  condition {
    http_header {
      http_header_name = "X-Origin-Verify"
      values           = [random_password.origin_verify.result]
    }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_route53_record" "api_origin" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = local.api_origin_host
  type    = "A"

  alias {
    name                   = aws_lb.api.dns_name
    zone_id                = aws_lb.api.zone_id
    evaluate_target_health = true
  }
}

# --- CloudFront ----------------------------------------------------------------

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

data "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "Managed-SecurityHeadersPolicy"
}

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${local.name}-s3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Client-side routes (/courses/plumbing) have no file in S3; serve the app shell instead.
resource "aws_cloudfront_function" "spa_routes" {
  name    = "${local.name}-spa-routes"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-JS
    function handler(event) {
      var request = event.request;
      var last = request.uri.substring(request.uri.lastIndexOf('/') + 1);
      if (last.indexOf('.') === -1) {
        request.uri = '/index.html';
      }
      return request;
    }
  JS
}

resource "aws_cloudfront_distribution" "app" {
  enabled             = true
  comment             = "CyberLearn ${var.environment}"
  aliases             = [var.app_hostname]
  default_root_object = "index.html"
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  # PriceClass_200 includes the African edge locations (Nairobi, Lagos, Johannesburg).
  price_class = "PriceClass_200"

  origin {
    origin_id                = "web"
    domain_name              = module.web_bucket.regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    origin_id                = "media"
    domain_name              = module.media_bucket.regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    origin_id   = "api"
    domain_name = local.api_origin_host

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_read_timeout    = 30 # the API times requests out at 25s
    }

    custom_header {
      name  = "X-Origin-Verify"
      value = random_password.origin_verify.result
    }
  }

  default_cache_behavior {
    target_origin_id           = "web"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.security_headers.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_routes.arn
    }
  }

  ordered_cache_behavior {
    path_pattern               = "/api/*"
    target_origin_id           = "api"
    viewer_protocol_policy     = "https-only"
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.security_headers.id
  }

  ordered_cache_behavior {
    path_pattern               = "/media/*"
    target_origin_id           = "media"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.security_headers.id
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.app.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "app" {
  for_each = toset(["A", "AAAA"])

  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.app_hostname
  type    = each.value

  alias {
    name                   = aws_cloudfront_distribution.app.domain_name
    zone_id                = aws_cloudfront_distribution.app.hosted_zone_id
    evaluate_target_health = false
  }
}
