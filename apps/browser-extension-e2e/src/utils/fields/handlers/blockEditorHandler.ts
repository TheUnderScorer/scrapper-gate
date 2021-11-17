import { FieldHandler } from '../fields.types';

export const blockEditorHandler = (
  value: string
): FieldHandler<HTMLElement, string> => ({
  providedValue: value,
  fill: async (field, page) => {
    await field.focus();

    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    await field.fill(value);
  },
  getInputValue: async (field) => {
    const value = await field.textContent();

    return value ?? '';
  },
});
