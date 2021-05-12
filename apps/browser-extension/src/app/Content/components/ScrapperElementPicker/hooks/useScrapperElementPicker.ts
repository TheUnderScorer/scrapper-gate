import { useMemo } from 'react';
import {
  useContainerStore,
  useIsUsingElementPicker,
} from '@scrapper-gate/frontend/common';
import {
  FieldNameCreator,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { useIsOnStepUrl } from '../../../hooks/useIsOnStepUrl';
import { useActiveTabUrl } from '../../../../../extension/browser/hooks/useActiveTabUrl';

export interface UseScrapperElementPickerProps {
  fieldNameCreator: FieldNameCreator;
  disabled?: boolean;
}

export function useScrapperElementPicker({
  disabled,
  fieldNameCreator,
}: UseScrapperElementPickerProps) {
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

  const pickerDisabled = !isOnStepUrl || disabled || !activeTabUrl;

  return {
    root,
    setUsingElementPicker,
    container,
    isOnStepUrl,
    activeTabUrl,
    pickerDisabledTooltip,
    pickerDisabled,
  };
}
