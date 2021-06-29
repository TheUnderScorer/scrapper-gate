#!/bin/bash
echo "Waiting for S3 at address ${AWS_S3_ENDPOINT}/health, attempting every 5s"

until $(curl --silent --fail ${AWS_S3_ENDPOINT}/health | grep "\"s3\": \"running\"" > /dev/null); do
    printf '.'
    sleep 5
done

echo ' Success: Reached S3'
