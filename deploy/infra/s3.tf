resource "aws_s3_bucket" "screenshots_bucket" {
  bucket = "${var.env_name}-scrapper-screenshots"
  acl    = "private"
}
