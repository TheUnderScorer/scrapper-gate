import { LinearProgress } from '@mui/material';
import { RunStateEntity, RunStateIcon } from '@scrapper-gate/frontend/ui';
import { RunState } from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperRunNodeAddonBeforeProps } from './ScrapperRunNodeAddonBefore.types';

export const ScrapperRunNodeAddonBefore = ({
  node,
}: ScrapperRunNodeAddonBeforeProps) => {
  const state = node.data?.runResult?.state;

  return state !== RunState.InProgress ? (
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
  ) : (
    <LinearProgress
      className="step-in-progress"
      color="secondary"
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: '0',
        width: '100%',
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
    />
  );
};
