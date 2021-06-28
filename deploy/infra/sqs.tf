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
