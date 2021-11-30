import { FieldHandler } from '../fields.types';

export const textFieldHandler = (
  value: string | number
): FieldHandler<HTMLElement, string | number> => ({
  providedValue: value,
  fill: async (field) => {
    if (value) {
      await field.fill(value.toString());
    }
  },
  getInputValue: async (field) => {
    return field.inputValue();
  },
});
