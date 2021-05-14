import React from 'react';
import {
  HtmlElementPicker,
  HtmlElementPickerValidationRules,
} from '@scrapper-gate/frontend/ui';
import { ScrapperElementPickerProps } from '@scrapper-gate/frontend/domain/scrapper';
import { useScrapperElementPicker } from './hooks/useScrapperElementPicker';

export const ScrapperElementPicker = ({
  disabled,
  elementsValidator,
  fieldNameCreator,
  label = 'HTML Elements',
  name,
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

  return (
    <HtmlElementPicker
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
