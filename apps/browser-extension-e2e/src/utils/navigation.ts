import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { Page } from 'playwright';
import { logout } from '../actions/popup';
import { getPopupUrl } from './url';

export interface NavigateToPopupOptions {
  logoutIfAuthorized?: boolean;
}

const authRoutes = [
  browserExtensionRoutes.popup.login,
  browserExtensionRoutes.popup.signUp,
];

export const navigateToPopup = async (
  page: Page,
  { logoutIfAuthorized }: NavigateToPopupOptions = {}
) => {
  const url = await getPopupUrl(page.context());

  await page.goto(url.toString(), {
    waitUntil: 'networkidle',
  });

  const pageUrl = page.url();

  const result = {
    isAuthorized: !authRoutes.some((route) => pageUrl.includes(route)),
  };

  if (result.isAuthorized && logoutIfAuthorized) {
    try {
      await logout(page);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  return result;
};
