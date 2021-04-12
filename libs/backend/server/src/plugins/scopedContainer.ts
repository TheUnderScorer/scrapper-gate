import { FastifyInstance } from 'fastify';
import { asValue, AwilixContainer } from 'awilix';

export const scopedContainer = (
  container: AwilixContainer,
  instance: FastifyInstance
) => {
  instance.addHook('preHandler', async (req) => {
    req.container = container.createScope();
    req.container.register({
      container: asValue(req.container),
    });

    req.rootContainer = container;
  });

  instance.addHook('onResponse', async (req) => {
    if (req.container) {
      await req.container.dispose();
    }
  });
};
