import { clearFocusedFieldWithKeyboard } from '../../utils/clearFocusedFieldWithKeyboard';
import { FieldHandler } from '../fields.types';

export const blockEditorHandler = (
  value: string
): FieldHandler<HTMLElement, string> => ({
  providedValue: value,
  fill: async (field, page) => {
    await field.focus();
    await clearFocusedFieldWithKeyboard(page);

    await field.fill(value.toString());
  },
  getInputValue: async (field) => {
    const value = await field.textContent();

    return value ?? '';
  },
});
