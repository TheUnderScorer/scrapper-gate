import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import { ElementHandle } from 'playwright';
import { FieldHandler } from '../fields.types';

const getWrapper = async (field: ElementHandle): Promise<ElementHandle> => {
  const wrapper = await field.evaluateHandle((el: HTMLElement) =>
    el.closest('.html-element-picker-wrapper')
  );

  if (!wrapper) {
    throw new Error('Element picker wrapper not found');
  }

  return wrapper.asElement() as ElementHandle;
};

export const elementPickerHandler = (
  selectors: string[],
  mode: 'type' | 'selectElement'
): FieldHandler<HTMLElement, string[]> => ({
  providedValue: selectors,
  fill: async (field) => {
    if (mode === 'type') {
      for (const selector of selectors) {
        await field.fill(selector);
        await field.press('Enter');
      }

      return;
    }

    throw new Error(`${mode} is not supported for html element picker.`);
  },
  getInputValue: async (field) => {
    const wrapper = await getWrapper(field);
    const selectors = await wrapper.$$('.selector-list-item');

    const result = await Promise.all(
      selectors.map((selector) => selector.getAttribute('data-value'))
    );

    return result.filter(ExcludeFalsy);
  },
});
