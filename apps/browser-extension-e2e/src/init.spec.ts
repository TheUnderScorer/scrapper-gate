describe('Init', () => {
  it('should have extension enabled', async () => {
    const workers = await global.browser.serviceWorkers();

    expect(workers).toHaveLength(1);
  }, 9999999);
});
