import { resolveModifier } from '@scrapper-gate/shared/common';
import { Page } from 'playwright';

export const clearFocusedFieldWithKeyboard = async (page: Page) => {
  const modifier = resolveModifier();

  await page.keyboard.press(`${modifier}+A`);
  await page.keyboard.press('Backspace');
};
