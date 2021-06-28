import { createContainer } from '../container/container';
import '../typings/global';

beforeEach(async () => {
  const container = await createContainer({
    dbConnection: global.connection,
  });

  global.server = container.resolve('server');
  global.container = container;
});

afterEach(async () => {
  if (global.server) {
    global.server.close();
  }

  if (global.container) {
    await global.container.dispose();
  }
});
