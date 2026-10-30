###############################################################################
# S3: the built PWA, lesson media, and educator uploads. All private; the
# first two are read only by CloudFront, uploads only by the API's role.
###############################################################################

module "web_bucket" {
  source = "./modules/private-bucket"
  name   = "${local.name}-web"
}

module "media_bucket" {
  source     = "./modules/private-bucket"
  name       = "${local.name}-media"
  versioning = true
}

module "uploads_bucket" {
  source     = "./modules/private-bucket"
  name       = "${local.name}-uploads"
  versioning = true
}

data "aws_iam_policy_document" "cloudfront_read" {
  for_each = {
    web   = module.web_bucket.arn
    media = module.media_bucket.arn
  }

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${each.value}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.app.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = module.web_bucket.id
  policy = data.aws_iam_policy_document.cloudfront_read["web"].json
}

resource "aws_s3_bucket_policy" "media" {
  bucket = module.media_bucket.id
  policy = data.aws_iam_policy_document.cloudfront_read["media"].json
}
