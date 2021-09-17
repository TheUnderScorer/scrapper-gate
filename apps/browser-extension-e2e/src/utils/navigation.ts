import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { Page } from 'playwright';
import { logout } from '../actions/popup';
import { getPopupUrl } from './url';

export interface NavigateToPopupOptions {
  logoutIfAuthorized?: boolean;
}

export const navigateToPopup = async (
  page: Page,
  { logoutIfAuthorized }: NavigateToPopupOptions = {}
) => {
  const url = await getPopupUrl();

  await page.goto(url.toString(), {
    waitUntil: 'networkidle',
  });

  const result = {
    isAuthorized: !page.url().includes(browserExtensionRoutes.popup.login),
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
