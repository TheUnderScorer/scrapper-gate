import { navigateToPopup } from '../../utils/navigation';

describe('Popup', () => {
  it('should show login form if user is not logged in', async () => {
    const page = await global.browser.newPage();

    await navigateToPopup(page);

    const auth = await page.$('.auth');

    expect(auth).not.toBeNull();
  });
});
