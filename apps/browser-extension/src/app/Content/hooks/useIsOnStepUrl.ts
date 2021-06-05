import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import { useMemo } from 'react';
import { useActiveTabUrl } from '../../../extension/browser/hooks/useActiveTabUrl';
import { areUrlsEqual } from '@scrapper-gate/shared/common';
import { ScrapperStep } from '@scrapper-gate/shared/schema';

export const useIsOnStepUrl = ({
  url,
  useUrlFromPreviousStep,
}: Pick<ScrapperStep, 'url' | 'useUrlFromPreviousStep'>) => {
  const activeTabUrl = useActiveTabUrl();

  return useMemo(
    () =>
      useUrlFromPreviousStep ||
      containsVariableKey(url) ||
      areUrlsEqual(url, activeTabUrl),
    [url, useUrlFromPreviousStep, activeTabUrl]
  );
};
