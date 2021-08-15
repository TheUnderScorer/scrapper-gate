import { CircularProgress, Tooltip } from '@material-ui/core';
import { Check, Warning } from '@material-ui/icons';
import { isRunning } from '@scrapper-gate/shared/run-states';
import { RunState } from '@scrapper-gate/shared/schema';
import { useMemo } from 'react';
import { RunStateIconProps } from './RunStateIcon.types';

const titleStateMap: Record<RunState, string> = {
  [RunState.Pending]: 'This step is currently pending.',
  [RunState.Cancelled]: 'This step run was cancelled.',
  [RunState.Completed]: 'This step was completed.',
  [RunState.Failed]: 'This step has failed.',
  [RunState.Skipped]: 'This step was skipped.',
  [RunState.InProgress]: 'This step is currently running',
};

export const RunStateIcon = ({
  state,
  runMutationCalled,
  runMutationLoading,
  className,
  showTooltip,
}: RunStateIconProps) => {
  const icon = useMemo(() => {
    const running = isRunning(state);

    if (
      state === RunState.Completed &&
      runMutationCalled &&
      !runMutationLoading
    ) {
      return <Check />;
    }

    if (state === RunState.Skipped) {
      return <Warning />;
    }

    return running ? <CircularProgress size={20} /> : null;
  }, [runMutationCalled, runMutationLoading, state]);

  if (!icon) {
    return null;
  }

  return (
    <Tooltip title={showTooltip && state ? titleStateMap[state] : ''}>
      <span className={className}>{icon}</span>
    </Tooltip>
  );
};
