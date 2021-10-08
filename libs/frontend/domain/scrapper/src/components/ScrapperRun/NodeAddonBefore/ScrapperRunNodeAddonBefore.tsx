import { RunStateEntity, RunStateIcon } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { ScrapperRunNodeAddonBeforeProps } from './ScrapperRunNodeAddonBefore.types';

export const ScrapperRunNodeAddonBefore = ({
  node,
}: ScrapperRunNodeAddonBeforeProps) => {
  const state = node.data?.runResult?.state;

  return (
    <RunStateIcon
      sx={{
        position: 'absolute',
        top: '-30%',
        right: '-0',
      }}
      entity={RunStateEntity.Scrapper}
      state={state}
      runMutationCalled
      showTooltip
    />
  );
};
