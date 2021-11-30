import { ElementHandle } from 'playwright';
import { FieldHandler } from '../fields.types';

const getParent = (field: ElementHandle) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  field.evaluateHandle((element) => element.parentElement!);

export const selectHandler = (
  value: string
): FieldHandler<HTMLElement, string> => ({
  providedValue: value,
  fill: async (field, page) => {
    const parent = await getParent(field);

    await parent.click();

    await page.click(`[data-value="${value}"]`);
  },
  getInputValue: async (field) => {
    return field.inputValue();
  },
});
