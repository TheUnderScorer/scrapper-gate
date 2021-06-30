resource "aws_s3_bucket" "screenshots_bucket" {
  bucket = "${var.env_name}-scrapper-screenshots"
  acl    = "private"
}


resource "aws_ssm_parameter" "screenshots_bucket" {
  name  = "${var.env_name}-screenshots-bucket"
  type  = "String"
  value = aws_s3_bucket.screenshots_bucket.bucket
  count = var.premium_localstack_services_count
}
