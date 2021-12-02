import { $ } from 'zx';
import { ConsecutiveBreaker, Policy, TimeoutStrategy } from 'cockatiel';
import { logger } from '@nrwl/devkit';

const timeoutPolicy = Policy.timeout(9000_000, TimeoutStrategy.Aggressive);
const circuitBreaker = Policy.handleAll().circuitBreaker(10 * 1000, new ConsecutiveBreaker(2));
const retry = Policy.handleAll().retry().attempts(5).exponential();

const policy = Policy.wrap(retry, circuitBreaker, timeoutPolicy);

const stack = 'development';

async function up() {
  try {
    await $`pulumi stack init ${stack} && pulumi stack select ${stack} && pulumi up -y`;
  } catch (error) {
    logger.error(error);

    await $`pulumi destroy -y`;

    throw error;
  }
}

async function main() {
  logger.info('Spinning up local env...');

  policy.onFailure((data) => {
    logger.error(JSON.stringify(data));
  });

  await policy.execute(() => up());
}

main().catch(() => {
  process.exit(1);
});
