import { ApolloError } from '@apollo/client';
import { Divider, Stack, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  useGetMyScrapperRunQuery,
  useGetMyScrapperRunStateQuery,
} from '@scrapper-gate/frontend/schema';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import {
  ButtonRouteLink,
  FlowBuilder,
  FlowBuilderTabsSelection,
  flowBuilderUtils,
  RunState,
  RunStateEntity,
} from '@scrapper-gate/frontend/ui';
import { throwError } from '@scrapper-gate/shared/common';
import { isCompleted } from '@scrapper-gate/shared/run-states';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';
import { v4 } from 'uuid';
import { scrapperRunPollMs } from '../../shared/constants';
import { createScrapperNodeSelection } from '../../shared/scrapperNodeSelection';
import { ScrapperRunNodeContent } from './NodeContent/ScrapperRunNodeContent';
import { ScrapperRunFormState, ScrapperRunProps } from './ScrapperRun.types';
import { scrapperRunToNodes } from './scrapperRunToNodes';
import { ScrapperRunValuesTable } from './ValuesTable/ScrapperRunValuesTable';

const selection = createScrapperNodeSelection();

const initialNodes = [
  flowBuilderUtils.createStartNode(
    {
      x: 0,
      y: 0,
    },
    true
  ),
];

const handleConnect = flowBuilderUtils.basicHandleConnect();
const handleAdd = flowBuilderUtils.basicHandleAddNode(() => v4());

const useStyles = makeStyles(() => ({
  divider: {
    height: '30px',
  },
}));

export const ScrapperRun = ({
  runId,
  onQueryError,
  scrapperUrlCreator,
  ...rest
}: ScrapperRunProps) => {
  const classes = useStyles();

  const snackbarOnError = useSnackbarOnError();

  const handleError = useCallback(
    (error: ApolloError) => {
      snackbarOnError(error);

      onQueryError?.(error);
    },
    [onQueryError, snackbarOnError]
  );

  const { startPolling, stopPolling } = useGetMyScrapperRunStateQuery({
    variables: {
      id: runId,
    },
    onError: handleError,
  });

  const { data, loading } = useGetMyScrapperRunQuery({
    variables: {
      id: runId,
    },
    onError: handleError,
    onCompleted: (data) => {
      startPolling(scrapperRunPollMs);

      if (!isCompleted(data?.getMyScrapperRun?.state)) {
        startPolling(scrapperRunPollMs);
      }
    },
  });

  useEffect(() => {
    if (isCompleted(data?.getMyScrapperRun?.state)) {
      stopPolling();
    }
  }, [data, stopPolling]);

  const nodesCreator = useMemo(
    () =>
      data?.getMyScrapperRun
        ? scrapperRunToNodes(data.getMyScrapperRun, selection)
        : undefined,
    [data]
  );

  const values = useMemo<ScrapperRunFormState>(
    () => ({
      items: initialNodes,
    }),
    []
  );

  const tabs = useMemo<FlowBuilderTabsSelection[]>(
    () => [
      {
        label: 'Values',
        value: 'values',
        content: (
          <ScrapperRunValuesTable
            values={data?.getMyScrapperRun?.keyPairValues}
          />
        ),
      },
    ],
    [data]
  );

  return (
    <Form
      initialValues={values}
      onSubmit={throwError('Submit not allowed.')}
      render={() => (
        <FlowBuilder
          tabs={tabs}
          onAdd={handleAdd}
          onConnect={handleConnect}
          loading={loading}
          nodesCreator={nodesCreator}
          nodesSelection={selection}
          nodeContentTitle="Step result"
          nodeKeyProperty="data.key"
          defaultNodeContent={ScrapperRunNodeContent}
          readOnly
          title={
            <Stack direction="row" spacing={2} alignItems="center">
              <span>
                <Typography variant="h6">
                  {data?.getMyScrapperRun?.name}
                </Typography>
                {data?.getMyScrapperRun?.scrapper && (
                  <Typography>
                    from{' '}
                    <ButtonRouteLink
                      to={scrapperUrlCreator({
                        scrapperId: data.getMyScrapperRun.scrapper.id,
                      })}
                    >
                      {data.getMyScrapperRun.scrapper.name}
                    </ButtonRouteLink>
                  </Typography>
                )}
              </span>
              <Divider orientation="vertical" className={classes.divider} />
              {data?.getMyScrapperRun && (
                <Typography>
                  <RunState
                    showIcon
                    runMutationCalled
                    state={data.getMyScrapperRun.state}
                    entity={RunStateEntity.Scrapper}
                    entityName={data.getMyScrapperRun.name ?? ''}
                  />
                </Typography>
              )}
            </Stack>
          }
          {...rest}
        />
      )}
    />
  );
};
