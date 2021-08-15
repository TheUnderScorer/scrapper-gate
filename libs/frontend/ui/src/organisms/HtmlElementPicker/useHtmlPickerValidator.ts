import { getElementsBySelectors } from '@scrapper-gate/shared/common';
import { InvalidSelectorProvidedError } from '@scrapper-gate/shared/errors';
import { Selector } from '@scrapper-gate/shared/schema';
import { useCallback } from 'react';
import {
  HtmlElementPickerProps,
  HtmlElementPickerValidationRules,
} from './HtmlElementPicker.types';

export type UseHtmlPickerValidatorProps = Pick<
  HtmlElementPickerProps,
  'validationRules' | 'pickerDisabled' | 'elementsValidator'
> &
  Pick<Required<HtmlElementPickerProps>, 'filterSelectorsForValidation'>;

export const useHtmlPickerValidator = ({
  elementsValidator,
  pickerDisabled,
  validationRules,
  filterSelectorsForValidation,
}: UseHtmlPickerValidatorProps) => {
  return useCallback(
    (fieldValue?: Selector[]) => {
      if (fieldValue?.length && validationRules?.length && !pickerDisabled) {
        try {
          const filteredValue = filterSelectorsForValidation(fieldValue ?? []);
          const elements = getElementsBySelectors(filteredValue, document);

          if (
            !elements.length &&
            validationRules?.includes(
              HtmlElementPickerValidationRules.ElementsExist
            )
          ) {
            return new Error('No elements found matching given selector');
          }

          if (elementsValidator) {
            return elementsValidator(elements);
          }
        } catch (e) {
          if (
            !validationRules?.includes(
              HtmlElementPickerValidationRules.ValidSelector
            )
          ) {
            return undefined;
          }

          return new InvalidSelectorProvidedError();
        }
      }

      return undefined;
    },
    [
      validationRules,
      pickerDisabled,
      filterSelectorsForValidation,
      elementsValidator,
    ]
  );
};
