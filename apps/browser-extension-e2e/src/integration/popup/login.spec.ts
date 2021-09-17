import { repeatUntil } from '@scrapper-gate/shared/common';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { logout, register } from '../../actions/popup';
import { navigateToPopup } from '../../utils/navigation';

describe('Popup login', () => {
  it('should let user login', async () => {
    const { page, email, password } = await register();

    await logout(page);

    expect(page.url()).toContain(browserExtensionRoutes.popup.login);

    await page.type('#username', email);
    await page.type('#password', password);

    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    await repeatUntil(async () =>
      expect(page.url()).toContain(browserExtensionRoutes.popup.scrappers)
    );
  });

  it('should show error if provided credentials are not valid', async () => {
    const page = await global.browser.newPage();

    await navigateToPopup(page, {
      logoutIfAuthorized: true,
    });

    await page.type('#username', 'invalid@test.com');
    await page.type('#password', 'randompassword');

    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    await repeatUntil(async () => {
      const errorAlert = await page.$('.error-alert');
      const textContent = await errorAlert?.textContent();

      expect(textContent).toContain('Wrong username or password');
    });
  });
});
