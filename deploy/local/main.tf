terraform {
  backend "local" {}
}

provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "eu-west-1"
  s3_force_path_style         = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3     = "http://0.0.0.0:4566"
    lambda = "http://0.0.0.0:4566"
    iam    = "http://0.0.0.0:4566"
    sqs    = "http://0.0.0.0:4566"
  }
}

module "scrapper-gate" {
  source             = "../infra"
  env_name           = "local"
  dev_services_count = 1
}

