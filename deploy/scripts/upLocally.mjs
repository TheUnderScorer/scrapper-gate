import { $ } from 'zx';
import { Policy } from 'cockatiel';
import { logger } from '@nrwl/devkit';

const retry = Policy.handleAll().retry().attempts(3).exponential();
const stack = 'development';

async function up() {
  try {
    await $`pulumi stack init ${stack} && pulumi stack select ${stack} && pulumi up -y`;
  } catch(error) {
    logger.error(error);

    await $`pulumi destroy -y`;

    throw error;
  }
}

async function main() {
  logger.info('Spinning up local env...');

  retry.onRetry((data) => {
    logger.error(JSON.stringify(data));
  });

  await retry.execute(() => up());
}

main().catch(() => {
  process.exit(1);
});
