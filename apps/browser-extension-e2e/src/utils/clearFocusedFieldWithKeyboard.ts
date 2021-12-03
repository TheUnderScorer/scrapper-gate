import { Page } from 'playwright';

export const clearFocusedFieldWithKeyboard = async (page: Page) => {
  const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';

  await page.keyboard.press(`${modifier}+A`);
  await page.keyboard.press('Backspace');
};
