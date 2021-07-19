docker compose up -d

AWS_S3_ENDPOINT=http://localhost:4566 sh ./docker/localstack/wait-for-it.sh

cd deploy/local && terraform apply -auto-approve
