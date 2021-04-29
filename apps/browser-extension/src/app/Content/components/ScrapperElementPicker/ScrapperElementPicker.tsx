import React, { useMemo } from 'react';
import {
  HtmlElementPicker,
  HtmlElementPickerValidationRules,
} from '@scrapper-gate/frontend/ui';
import { useActiveTabUrl } from '../../../../extension/browser/hooks/useActiveTabUrl';
import { ScrapperElementPickerProps } from '@scrapper-gate/frontend/domain/scrapper';
import { useIsOnStepUrl } from '../../hooks/useIsOnStepUrl';
import {
  useContainerStore,
  useIsUsingElementPicker,
} from '@scrapper-gate/frontend/common';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';

export const ScrapperElementPicker = ({
  disabled,
  elementsValidator,
  fieldNameCreator,
  label = 'HTML Elements',
}: ScrapperElementPickerProps) => {
  const root = useMemo(
    () => document.querySelector<HTMLElement>('#scrapper_gate_content_root'),
    []
  );

  const [, setUsingElementPicker] = useIsUsingElementPicker();
  const container = useContainerStore((store) => store.container);

  const url = useFormFieldValue<string>(fieldNameCreator('url'));
  const useUrlFromPreviousStep = useFormFieldValue<boolean>(
    fieldNameCreator('useUrlFromPreviousStep')
  );

  const isOnStepUrl = useIsOnStepUrl({
    url,
    useUrlFromPreviousStep,
  });
  const activeTabUrl = useActiveTabUrl();

  const pickerDisabledTooltip = useMemo(() => {
    if (!activeTabUrl) {
      return 'Element picker is disabled on this page.';
    }

    if (!isOnStepUrl) {
      return 'Element picker is not available when you are on different page.';
    }

    return '';
  }, [activeTabUrl, isOnStepUrl]);

  return (
    <HtmlElementPicker
      validationRules={[HtmlElementPickerValidationRules.ValidSelector]}
      disabled={disabled}
      pickerDisabled={!isOnStepUrl || disabled || !activeTabUrl}
      pickerDisabledTooltip={pickerDisabledTooltip}
      container={(container as unknown) as Element}
      ignoredElementsContainer={root}
      onPickerToggle={setUsingElementPicker}
      name={fieldNameCreator('selectors')}
      label={label}
      highlightId="selectors"
      elementsValidator={elementsValidator}
    />
  );
};
