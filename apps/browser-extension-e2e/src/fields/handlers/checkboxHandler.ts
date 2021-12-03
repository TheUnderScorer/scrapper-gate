import { FieldHandler } from '../fields.types';

export const checkboxHandler = (
  value: boolean
): FieldHandler<HTMLElement, boolean> => ({
  providedValue: value,
  fill: async (field) => {
    await field.setChecked(value);
  },
  getInputValue: async (field) => {
    return field.isChecked();
  },
});
