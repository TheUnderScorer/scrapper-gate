import { $ } from 'zx';
import { waitForLocalStack } from '../docker/localstack/waitForLocalStack.mjs';
import { logger } from '@nrwl/devkit';

await $`docker compose up -d`;

logger.info('Waiting for local services...');

await waitForLocalStack('http://localhost:4566');

await $`cd deploy/local && terraform apply -auto-approve`;
