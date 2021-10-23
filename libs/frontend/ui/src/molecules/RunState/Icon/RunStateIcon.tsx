import { Box, CircularProgress, Tooltip } from '@mui/material';
import { Check, Error, Pending, Warning } from '@mui/icons-material';
import { isRunning } from '@scrapper-gate/shared/run-states';
import { RunState } from '@scrapper-gate/shared/schema';
import { ReactNode, useMemo } from 'react';
import { RunStateIconProps } from './RunStateIcon.types';

const titleStateMap: Record<RunState, string> = {
  [RunState.Pending]: 'This step is currently pending.',
  [RunState.Cancelled]: 'This step run was cancelled.',
  [RunState.Completed]: 'This step was completed.',
  [RunState.Failed]: 'This step has failed.',
  [RunState.Skipped]: 'This step was skipped.',
  [RunState.InProgress]: 'This step is currently running',
};

const stateIcons: {
  [Key in RunState]?: ReactNode;
} = {
  [RunState.Skipped]: <Warning />,
  [RunState.Pending]: <Pending />,
  [RunState.Failed]: <Error />,
};

export const RunStateIcon = ({
  state,
  runMutationCalled,
  runMutationLoading,
  className,
  showTooltip,
  sx,
  title,
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

    if (state && stateIcons[state]) {
      return stateIcons[state];
    }

    return running ? <CircularProgress size={20} /> : null;
  }, [runMutationCalled, runMutationLoading, state]);

  if (!icon) {
    return null;
  }

  return (
    <Tooltip title={showTooltip && state ? title ?? titleStateMap[state] : ''}>
      <Box component="span" sx={sx} className={className}>
        {icon}
      </Box>
    </Tooltip>
  );
};
