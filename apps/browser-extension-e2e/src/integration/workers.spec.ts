describe('Init', () => {
  it('should have extension enabled', async () => {
    const workers = global.browser.serviceWorkers();

    expect(workers).toHaveLength(1);
  });
});
