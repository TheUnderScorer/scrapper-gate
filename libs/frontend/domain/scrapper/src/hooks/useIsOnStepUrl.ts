import { useCurrentUrl } from '@scrapper-gate/frontend/common';
import { areUrlsEqual } from '@scrapper-gate/shared/common';
import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import { ScrapperStep } from '@scrapper-gate/shared/schema';
import { useMemo } from 'react';

export const useIsOnStepUrl = ({
  url,
  useUrlFromPreviousStep,
}: Pick<ScrapperStep, 'url' | 'useUrlFromPreviousStep'>) => {
  const currentUrl = useCurrentUrl((store) => store.currentUrl);

  return useMemo(() => {
    if (!currentUrl) {
      return false;
    }

    return (
      useUrlFromPreviousStep ||
      containsVariableKey(url) ||
      areUrlsEqual(url, currentUrl)
    );
  }, [url, useUrlFromPreviousStep, currentUrl]);
};
