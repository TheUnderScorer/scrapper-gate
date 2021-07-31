import { Button, CircularProgress, Stack, Typography } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { DateFormat } from '@scrapper-gate/shared/common';
import { isRunning } from '@scrapper-gate/shared/run-states';
import { RunState as RunStateEnum } from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RunStateProps } from './RunState.types';

export const RunState = ({
  state,
  entity,
  name,
  called,
  runMutationLoading,
  lastRunDate,
  runUrlCreator,
  resultId,
}: RunStateProps) => {
  const running = isRunning(state);

  const message = useMemo(() => {
    const runMessage = (
      <>
        You are about to run {entity} <strong>{name}</strong>.
      </>
    );

    if (!running && !called) {
      return runMessage;
    }

    const runLinkElement = runUrlCreator && resultId && (
      <Link to={runUrlCreator({ resultId })}>
        <Button variant="text">View run.</Button>
      </Link>
    );

    switch (state) {
      case RunStateEnum.Pending:
        return `Your ${entity} is currently in queue...`;

      case RunStateEnum.InProgress:
        return (
          <>
            Your {entity} is currently running. {runLinkElement}
          </>
        );

      case RunStateEnum.Failed:
        return (
          <>
            Your{!called ? ' last' : ''} run has failed. {runLinkElement}
          </>
        );

      case RunStateEnum.Completed:
        if (called && !runMutationLoading) {
          return (
            <>
              Your {entity} run has completed. {runLinkElement}
            </>
          );
        }

        return runMessage;

      case RunStateEnum.Cancelled:
        return `Your${!called ? ' last' : ''} run was cancelled.`;
    }
  }, [
    called,
    entity,
    name,
    resultId,
    runMutationLoading,
    runUrlCreator,
    running,
    state,
  ]);

  return (
    <Stack className="run-state-container" spacing={1}>
      <Stack alignItems="center" direction="row" spacing={2}>
        {running && <CircularProgress />}
        {state === RunStateEnum.Completed && called && !runMutationLoading && (
          <Check />
        )}
        <span>{message}</span>
      </Stack>
      {lastRunDate && !running && (
        <Typography variant="subtitle2">
          Last run finished at <i>{format(lastRunDate, DateFormat.DateTime)}</i>
          .
        </Typography>
      )}
    </Stack>
  );
};
