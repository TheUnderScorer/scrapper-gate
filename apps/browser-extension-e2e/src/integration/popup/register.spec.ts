import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { openDrawer, register } from '../../actions/popup';
import { createBrowser } from '../../browser';
import { navigateToPopup } from '../../utils/navigation';
import { repeatUntil } from '../../utils/repeatUntil';

describe('Popup register', () => {
  it('should show login form if user is not logged in', async () => {
    const browser = await createBrowser();
    const page = await browser.newPage();

    await navigateToPopup(page, {
      logoutIfAuthorized: true,
    });

    const auth = await page.$('.auth');

    expect(auth).not.toBeNull();
  });

  it('should let user create new account', async () => {
    const { page, email } = await register(await createBrowser());

    await repeatUntil(() =>
      expect(page.url()).toContain(browserExtensionRoutes.popup.scrappers)
    );

    await openDrawer(page);

    const userAvatar = await page.$('.user-avatar');

    expect(await userAvatar?.textContent()).toContain(email);
  });
});
