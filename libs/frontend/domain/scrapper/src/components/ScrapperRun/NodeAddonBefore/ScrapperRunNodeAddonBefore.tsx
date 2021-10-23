import { RunStateEntity, RunStateIcon } from '@scrapper-gate/frontend/ui';
import { RunState } from '@scrapper-gate/shared/schema';
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
      className="scrapper-run-state"
      entity={RunStateEntity.Scrapper}
      state={state}
      runMutationCalled
      showTooltip
      title={
        state === RunState.Failed
          ? `This step has failed, click for more details.`
          : undefined
      }
    />
  );
};
