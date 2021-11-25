/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogContentText,
  Typography,
} from '@mui/material';
import { removeTypename } from '@scrapper-gate/frontend/api-client';
import { useReturnUrlProvider } from '@scrapper-gate/frontend/common';
import { Dialog, useDialogMethods } from '@scrapper-gate/frontend/dialogs';
import { joiValidationResolver } from '@scrapper-gate/frontend/form';
import {
  useGetScrapperStateQuery,
  useSendScrapperToQueueMutation,
} from '@scrapper-gate/frontend/schema';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import { RunState, RunStateEntity } from '@scrapper-gate/frontend/ui';
import { isCompleted, isRunning } from '@scrapper-gate/shared/run-states';
import {
  Maybe,
  RunState as RunStateEnum,
  ScrapperForRunFragment,
  ScrapperRunSettingsInput,
} from '@scrapper-gate/shared/schema';
import { ScrapperRunSettingsInputSchema } from '@scrapper-gate/shared/validation';
import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import { useMount } from 'react-use';
import { scrapperRunPollMs } from '../../shared/constants';
import { ScrapperRunSettingsForm } from '../ScrapperRunSettingsForm/ScrapperRunSettingsForm';
import { RunScrapperDialogProps } from './RunScrapperDialog.types';

export const runScrapperDialogId = 'RUN_SCRAPPER';

const validate = joiValidationResolver(ScrapperRunSettingsInputSchema);

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

  const actualScrapper: Maybe<ScrapperForRunFragment> =
    getScrapperStateQueryData?.getMyScrapper ??
    data?.sendScrapperToRunnerQueue?.scrapper ??
    scrapper;

  const state = actualScrapper?.lastRun?.state;

  const running = isRunning(state);

  useMount(() => {
    if (running) {
      startPolling?.(scrapperRunPollMs);
    }
  });

  const makeActions = useCallback(
    (onRun: () => unknown) =>
      running ? (
        <Button variant="contained" color="error">
          Cancel
        </Button>
      ) : (
        <Button onClick={onRun} variant="contained">
          {called ? 'Run again' : 'Confirm'}
        </Button>
      ),
    [called, running]
  );

  if (!actualScrapper) {
    return null;
  }

  const initialValues = removeTypename(actualScrapper.runSettings);

  return (
    <Form<ScrapperRunSettingsInput>
      validate={validate}
      onSubmit={(values) =>
        sendScrapper({
          variables: {
            input: {
              scrapperId: scrapper?.id as string,
              runSettings: values,
            },
          },
        })
      }
      initialValues={initialValues ?? undefined}
      render={(props) => (
        <Dialog
          maxWidth="sm"
          fullWidth
          loading={loading}
          cancelLabel={called || running ? 'Close' : undefined}
          onCancel={onCancel}
          id={runScrapperDialogId}
          title="Run scrapper"
          actions={makeActions(props.handleSubmit)}
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
          {!running && (
            <Accordion
              sx={{
                marginTop: (theme) => theme.spacing(2),
              }}
              variant="transparent"
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Run configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ScrapperRunSettingsForm getFieldName={(name) => name ?? ''} />
              </AccordionDetails>
            </Accordion>
          )}
        </Dialog>
      )}
    />
  );
};
