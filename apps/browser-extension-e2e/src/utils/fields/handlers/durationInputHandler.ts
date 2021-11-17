import { Duration } from '@scrapper-gate/shared/common';
import { DurationUnit } from '@scrapper-gate/shared/schema';
import { ElementHandle } from 'playwright';
import { FieldHandler } from '../fields.types';
import { selectHandler } from './selectHandler';

const getParent = async (field: ElementHandle<HTMLElement>) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  field.evaluateHandle((el) => el.closest('.duration-input-text-field')!);

export const durationInputHandler = (
  value: Duration
): FieldHandler<HTMLInputElement, Duration> => {
  const select = selectHandler(value.enteredUnit);

  async function getSelect(parent: ElementHandle) {
    return (await parent.waitForSelector(
      '.duration-input-field-select'
    )) as ElementHandle<HTMLElement>;
  }

  return {
    providedValue: value,
    fill: async (field, page) => {
      const parent = await getParent(field);

      await field.fill(value.valueOf().toString());

      await select.fill(await getSelect(parent), page);
    },
    getInputValue: async (field, page) => {
      const parent = await getParent(field);

      const inputValue = await field.inputValue();
      const selectField = await getSelect(parent);

      const unit = await select.getInputValue(
        await selectField.waitForSelector('input'),
        page
      );

      return Duration.fromUnit(parseFloat(inputValue), unit as DurationUnit);
    },
    compare: (duration) => Boolean(duration && value.equals(duration)),
  };
};
