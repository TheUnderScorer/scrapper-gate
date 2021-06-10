import { TextFieldProps } from '@material-ui/core';
import { createVariablesDecorator } from '@scrapper-gate/frontend/domain/variables';
import { TextFieldBlock } from '@scrapper-gate/frontend/form';
import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import { Selector } from '@scrapper-gate/shared/schema';
import React, { useCallback, KeyboardEvent } from 'react';
import {
  HtmlElementPicker,
  HtmlElementPickerValidationRules,
} from '@scrapper-gate/frontend/ui';
import { ScrapperElementPickerProps } from '@scrapper-gate/frontend/domain/scrapper';
import { useScrapperElementPicker } from './hooks/useScrapperElementPicker';

const decorator = createVariablesDecorator();

const TextFieldComponent = ({
  onChange,
  value,
  ...rest
}: Omit<TextFieldProps, 'ref'>) => {
  return (
    <TextFieldBlock
      decorator={decorator}
      {...rest}
      value={value as string}
      onChange={(text) =>
        onChange?.({
          target: {
            value: text,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      }
    />
  );
};

export const ScrapperElementPicker = ({
  disabled,
  elementsValidator,
  fieldNameCreator,
  label = 'HTML Elements',
  name,
  variant,
}: ScrapperElementPickerProps) => {
  const {
    root,
    setUsingElementPicker,
    container,
    pickerDisabledTooltip,
    pickerDisabled,
  } = useScrapperElementPicker({
    fieldNameCreator,
    disabled,
  });

  const filterSelectorsForValidation = useCallback(
    (selectors: Selector[]) =>
      selectors.filter(
        (selector) => !containsVariableKey(selector.value ?? '')
      ),
    []
  );

  /**
   * Don't add selector on enter if variable suggestions dropdown is open
   * */
  const shouldAddSelectorOnEnter = useCallback((event: KeyboardEvent) => {
    const rootNode = (event.target as HTMLElement).getRootNode() as HTMLElement;
    const suggestions = rootNode.querySelector(
      '.variable-suggestions-container'
    );

    return !suggestions;
  }, []);

  return (
    <HtmlElementPicker
      variant={variant}
      shouldAddSelectorOnEnter={shouldAddSelectorOnEnter}
      filterSelectorsForValidation={filterSelectorsForValidation}
      TextFieldComponent={TextFieldComponent}
      validationRules={[HtmlElementPickerValidationRules.ValidSelector]}
      disabled={disabled}
      pickerDisabled={pickerDisabled}
      pickerDisabledTooltip={pickerDisabledTooltip}
      container={container}
      portal={container}
      ignoredElementsContainer={root}
      onPickerToggle={setUsingElementPicker}
      name={name ?? fieldNameCreator('selectors')}
      label={label}
      highlightId="selectors"
      elementsValidator={elementsValidator}
    />
  );
};
