import { createBrowser } from '../browser';

describe('Init', () => {
  it('should have extension enabled', async () => {
    const browser = await createBrowser();

    const workers = browser.serviceWorkers();

    expect(workers).toHaveLength(1);
  });
});
