import { LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { RunStateEntity, RunStateIcon } from '@scrapper-gate/frontend/ui';
import { RunState } from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperRunNodeAddonBeforeProps } from './ScrapperRunNodeAddonBefore.types';

const useStyles = makeStyles((theme) => ({
  stateIcon: {
    position: 'absolute',
    top: '-30%',
    right: '-0',
  },
  progress: {
    position: 'absolute',
    zIndex: 2,
    top: '0',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
  },
}));

export const ScrapperRunNodeAddonBefore = ({
  node,
}: ScrapperRunNodeAddonBeforeProps) => {
  const classes = useStyles();

  const state = node.data?.runResult?.state;

  return (
    <>
      {state !== RunState.InProgress ? (
        <RunStateIcon
          entity={RunStateEntity.Scrapper}
          className={classes.stateIcon}
          state={state}
          runMutationCalled
          showTooltip
        />
      ) : (
        <LinearProgress className={classes.progress} color="secondary" />
      )}
    </>
  );
};
