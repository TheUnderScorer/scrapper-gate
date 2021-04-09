import { createContainer } from '../container';
import '../typings/global';

beforeEach(async () => {
  const container = await createContainer({
    dbConnection: global.connection,
  });

  global.server = container.resolve('server');
  global.container = container;
});

afterEach(() => {
  if (global.server) {
    global.server.close();
  }
});
