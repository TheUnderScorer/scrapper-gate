import { Stack, Typography } from '@material-ui/core';
import { DateFormat } from '@scrapper-gate/shared/common';
import { isRunning } from '@scrapper-gate/shared/run-states';
import { RunState as RunStateEnum } from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { ButtonRouteLink } from '../ButtonRouteLink/ButtonRouteLink';
import { RunStateIcon } from './Icon/RunStateIcon';
import { RunStateProps } from './RunState.types';

export const RunState = ({
  state,
  entity,
  entityName,
  runMutationCalled,
  runMutationLoading,
  lastRunDate,
  runUrlCreator,
  runId,
  onRunUrlClick,
  returnUrl,
  showIcon,
}: RunStateProps) => {
  const running = isRunning(state);

  const runLinkElement = useMemo(
    () =>
      runUrlCreator &&
      runId && (
        <ButtonRouteLink
          onClick={onRunUrlClick}
          to={runUrlCreator({ runId, returnUrl })}
        >
          View run
        </ButtonRouteLink>
      ),
    [onRunUrlClick, returnUrl, runId, runUrlCreator]
  );

  const message = useMemo(() => {
    const runMessage = (
      <>
        You are about to run {entity} <strong>{entityName}</strong>.
      </>
    );

    if (!running && !runMutationCalled) {
      return runMessage;
    }

    switch (state) {
      case RunStateEnum.Pending:
        return (
          <>
            Your {entity} is currently in queue. {runLinkElement}
          </>
        );

      case RunStateEnum.InProgress:
        return (
          <>
            Your {entity} is currently running. {runLinkElement}
          </>
        );

      case RunStateEnum.Failed:
        return (
          <>
            Your{!runMutationCalled ? ' last' : ''} run has failed.{' '}
            {runLinkElement}
          </>
        );

      case RunStateEnum.Completed:
        if (runMutationCalled && !runMutationLoading) {
          return (
            <>
              Your {entity} run has completed. {runLinkElement}
            </>
          );
        }

        return runMessage;

      case RunStateEnum.Cancelled:
        return `Your${!runMutationCalled ? ' last' : ''} run was cancelled.`;
    }
  }, [
    runMutationCalled,
    entity,
    entityName,
    runLinkElement,
    runMutationLoading,
    running,
    state,
  ]);

  return (
    <Stack className="run-state-container" spacing={1}>
      <Stack alignItems="center" direction="row" spacing={3}>
        {showIcon && (
          <RunStateIcon
            entity={entity}
            state={state}
            runMutationCalled={runMutationCalled}
            runMutationLoading={runMutationLoading}
          />
        )}
        <span>{message}</span>
      </Stack>
      {lastRunDate && !running && !runMutationCalled && (
        <Typography variant="subtitle2">
          Last run finished at <i>{format(lastRunDate, DateFormat.DateTime)}</i>
          . {runLinkElement}
        </Typography>
      )}
    </Stack>
  );
};
