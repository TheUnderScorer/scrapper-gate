import { createContainer } from './container/container';
import { FastifyInstance } from 'fastify';

async function main() {
  const container = await createContainer();
  const server = container.resolve<FastifyInstance>('server');
  const port = container.resolve<number>('port');

  await server.listen(port, '0.0.0.0');
}

main().catch(console.error);
