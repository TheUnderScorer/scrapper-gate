import { useCallback } from 'react';
import { Selector } from '@scrapper-gate/shared/schema';
import { getElementsBySelectors } from '@scrapper-gate/shared/common';
import {
  HtmlElementPickerProps,
  HtmlElementPickerValidationRules,
} from './HtmlElementPicker.types';
import { useDebouncedValidator } from '@scrapper-gate/frontend/form';
import { InvalidSelectorProvidedError } from '@scrapper-gate/shared/errors';

export type UseHtmlPickerValidatorProps = Pick<
  HtmlElementPickerProps,
  'validationRules' | 'pickerDisabled' | 'elementsValidator'
>;

export const useHtmlPickerValidator = ({
  elementsValidator,
  pickerDisabled,
  validationRules,
}: UseHtmlPickerValidatorProps) => {
  const validateFn = useCallback(
    (fieldValue?: Selector[]) => {
      if (fieldValue?.length && validationRules.length && !pickerDisabled) {
        try {
          const elements = getElementsBySelectors(fieldValue ?? [], document);

          if (
            !elements.length &&
            validationRules.includes(
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
            !validationRules.includes(
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
    [validationRules, pickerDisabled, elementsValidator]
  );

  return useDebouncedValidator<Selector[]>({
    validate: validateFn,
  });
};
