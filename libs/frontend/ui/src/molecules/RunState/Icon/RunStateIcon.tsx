import { Box, Chip, CircularProgress, Tooltip } from '@mui/material';
import { Check, Error, Pending, Warning } from '@mui/icons-material';
import { isRunning } from '@scrapper-gate/shared/run-states';
import { RunState } from '@scrapper-gate/shared/schema';
import { ReactElement, ReactNode, useMemo } from 'react';
import { RunStateIconProps } from './RunStateIcon.types';

const titleStateMap: Record<RunState, string> = {
  [RunState.Pending]: 'Pending...',
  [RunState.Cancelled]: 'Cancelled',
  [RunState.Completed]: 'Completed',
  [RunState.Failed]: 'Failed',
  [RunState.Skipped]: 'Skipped',
  [RunState.InProgress]: 'In progress...',
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
  mode = 'icon',
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

  if (!icon || !state) {
    return null;
  }

  if (mode === 'chip') {
    return (
      <Chip
        color="secondary"
        icon={icon as ReactElement}
        label={title ?? titleStateMap[state]}
      />
    );
  }

  return (
    <Tooltip title={showTooltip && state ? title ?? titleStateMap[state] : ''}>
      <Box component="span" sx={sx} className={className}>
        {icon}
      </Box>
    </Tooltip>
  );
};
