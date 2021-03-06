/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, DialogContentText } from '@material-ui/core';
import { useReturnUrlProvider } from '@scrapper-gate/frontend/common';
import { Dialog, useDialogMethods } from '@scrapper-gate/frontend/dialogs';
import {
  useGetScrapperStateQuery,
  useSendScrapperToQueueMutation,
} from '@scrapper-gate/frontend/schema';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import { RunState, RunStateEntity } from '@scrapper-gate/frontend/ui';
import { isCompleted, isRunning } from '@scrapper-gate/shared/run-states';
import { Maybe, RunState as RunStateEnum } from '@scrapper-gate/shared/schema';
import React from 'react';
import { useMount } from 'react-use';
import { scrapperRunPollMs } from '../../shared/constants';
import {
  RunScrapperDialogProps,
  ScrapperForRun,
} from './RunScrapperDialog.types';

export const runScrapperDialogId = 'RUN_SCRAPPER';

export const RunScrapperDialog = ({
  scrapper,
  onCancel,
  onRun,
  runUrlCreator,
}: RunScrapperDialogProps) => {
  const returnUrl = useReturnUrlProvider();

  const { cancel } = useDialogMethods({
    id: runScrapperDialogId,
    onCancel,
  });

  const snackbarOnError = useSnackbarOnError();

  const {
    startPolling,
    stopPolling,
    data: getScrapperStateQueryData,
  } = useGetScrapperStateQuery({
    onError: snackbarOnError,
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: scrapper!.id,
    },
    skip: !scrapper,
    onCompleted: (data) => {
      if (isCompleted(data?.getMyScrapper?.lastRun?.state)) {
        stopPolling?.();
      }
    },
  });

  const [sendScrapper, { called, loading, data }] =
    useSendScrapperToQueueMutation({
      variables: {
        input: {
          scrapperId: scrapper?.id as string,
        },
      },
      onError: snackbarOnError,
      onCompleted: (data) => {
        if (
          data?.sendScrapperToRunnerQueue?.run?.state === RunStateEnum.Pending
        ) {
          startPolling?.(scrapperRunPollMs);

          onRun?.();
        }
      },
    });

  const actualScrapper = (getScrapperStateQueryData?.getMyScrapper ??
    data?.sendScrapperToRunnerQueue ??
    scrapper) as Maybe<ScrapperForRun>;

  const state = actualScrapper?.lastRun?.state;

  const running = isRunning(state);

  useMount(() => {
    if (running) {
      startPolling?.(scrapperRunPollMs);
    }
  });

  if (!actualScrapper) {
    return null;
  }

  const baseActions = running ? (
    <Button variant="contained" color="error">
      Cancel
    </Button>
  ) : (
    <Button onClick={() => sendScrapper()} variant="contained">
      {called ? 'Run again' : 'Confirm'}
    </Button>
  );

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      loading={loading}
      cancelLabel={called || running ? 'Close' : undefined}
      onCancel={onCancel}
      id={runScrapperDialogId}
      title="Run scrapper"
      actions={baseActions}
    >
      <DialogContentText component="div" whiteSpace="pre-wrap">
        <RunState
          returnUrl={returnUrl}
          showIcon
          onRunUrlClick={cancel}
          runId={actualScrapper?.lastRun?.id}
          runUrlCreator={runUrlCreator}
          runMutationLoading={loading}
          lastRunDate={
            actualScrapper?.lastRun?.endedAt
              ? new Date(actualScrapper?.lastRun?.endedAt)
              : undefined
          }
          entityName={actualScrapper.name ?? ''}
          runMutationCalled={called}
          state={state!}
          entity={RunStateEntity.Scrapper}
        />
      </DialogContentText>
    </Dialog>
  );
};
