import * as faker from 'faker';
import { BrowserContext, Page } from 'playwright';
import { navigateToPopup } from '../utils/navigation';

const password = 'testpassword123';

export async function register(browser: BrowserContext) {
  const page = await browser.newPage();

  await navigateToPopup(page, {
    logoutIfAuthorized: true,
  });

  await page.click('.sign-up');

  const email = faker.internet.email();

  await page.type('#username', email);

  await page.type('#password', password);

  await page.click('#acceptTerms');

  await page.click('button[type="submit"]');

  await page.waitForLoadState('networkidle');

  return { page, email, password };
}

export async function openDrawer(page: Page) {
  await page.click('.MuiToolbar-root button[aria-label="Open drawer"]');
}

export async function logout(page: Page) {
  await openDrawer(page);
  await page.click('.logout');
}
