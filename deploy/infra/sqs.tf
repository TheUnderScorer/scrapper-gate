resource "aws_sqs_queue" "chromium" {
  name       = "${var.env_name}-scrapper-chromium.fifo"
  fifo_queue = true
}

resource "aws_sqs_queue" "mozilla" {
  name       = "${var.env_name}-scrapper-mozilla.fifo"
  fifo_queue = true
}

resource "aws_sqs_queue" "webkit" {
  name       = "${var.env_name}-scrapper-webkit.fifo"
  fifo_queue = true
}

resource "aws_sqs_queue" "test" {
  name       = "${var.env_name}-message-queue-test.fifo"
  count      = var.dev_services_count
  fifo_queue = true
}

resource "aws_ssm_parameter" "chromium_queue_arn" {
  name  = "${var.env_name}-chromium-arn"
  type  = "String"
  value = aws_sqs_queue.chromium.arn
  count = var.premium_localstack_services_count
}

resource "aws_ssm_parameter" "mozilla_queue_arn" {
  name  = "${var.env_name}-mozilla-arn"
  type  = "String"
  value = aws_sqs_queue.mozilla.arn
  count = var.premium_localstack_services_count
}

resource "aws_ssm_parameter" "webkit_queue_arn" {
  name  = "${var.env_name}-webkit-arn"
  type  = "String"
  value = aws_sqs_queue.webkit.arn
  count = var.premium_localstack_services_count
}
