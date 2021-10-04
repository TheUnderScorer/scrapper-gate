import { ApolloError } from '@apollo/client';
import { Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { submitNotAllowed } from '@scrapper-gate/frontend/common';
import {
  FlowBuilder,
  FlowBuilderTabsSelection,
  flowBuilderUtils,
  NodeContentProps,
} from '@scrapper-gate/frontend/flow-builder';
import { useGetMyScrapperRunQuery } from '@scrapper-gate/frontend/schema';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import {
  ButtonRouteLink,
  ReturnBtn,
  RunState,
  RunStateEntity,
} from '@scrapper-gate/frontend/ui';
import { isCompleted } from '@scrapper-gate/shared/run-states';
import { Maybe } from '@scrapper-gate/shared/schema';
import { FormApi } from 'final-form';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Form } from 'react-final-form';
import { v4 } from 'uuid';
import { scrapperRunPollMs } from '../../shared/constants';
import { createScrapperNodeSelection } from '../../shared/scrapperNodeSelection';
import { ScrapperRunNodeContent } from './NodeContent/ScrapperRunNodeContent';
import { ScrapperRunFormState, ScrapperRunProps } from './ScrapperRun.types';
import { scrapperRunToNodes } from './scrapperRunToNodes';
import { ScrapperRunValuesTable } from './ValuesTable/ScrapperRunValuesTable';

const PREFIX = 'ScrapperRun';

const classes = {
  divider: `${PREFIX}-divider`,
};

const StyledStack = styled(Stack)(() => ({
  [`& .${classes.divider}`]: {
    height: '30px',
  },
}));

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

export const ScrapperRun = ({
  runId,
  onQueryError,
  scrapperUrlCreator,
  fetchPolicy,
  ...rest
}: ScrapperRunProps) => {
  const formRef = useRef<Maybe<FormApi<ScrapperRunFormState>>>();

  const snackbarOnError = useSnackbarOnError();

  const handleError = useCallback(
    (error: ApolloError) => {
      snackbarOnError(error);

      onQueryError?.(error);
    },
    [onQueryError, snackbarOnError]
  );

  const { data, loading, startPolling, stopPolling } = useGetMyScrapperRunQuery(
    {
      variables: {
        id: runId,
      },
      onError: handleError,
      fetchPolicy,
      onCompleted: (data) => {
        if (!isCompleted(data?.getMyScrapperRun?.state)) {
          startPolling(scrapperRunPollMs);
        }
      },
    }
  );

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

  // TODO Figure out if data here results in scrapper existing, or if we still need to keep form ref
  const initialValues = useMemo<ScrapperRunFormState>(
    () => ({
      items: initialNodes,
      scrapper: data?.getMyScrapperRun?.scrapper,
    }),
    [data]
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

  const nodeContent = useCallback(
    (props: NodeContentProps) => (
      <ScrapperRunNodeContent
        {...props}
        scrapperUrlCreator={scrapperUrlCreator}
      />
    ),
    [scrapperUrlCreator]
  );

  useEffect(() => {
    if (data?.getMyScrapperRun?.scrapper) {
      formRef.current?.change('scrapper', data.getMyScrapperRun.scrapper);
    }
  }, [data]);

  return (
    <Form<ScrapperRunFormState>
      initialValues={initialValues}
      onSubmit={submitNotAllowed}
      render={({ form }) => {
        formRef.current = form;

        return (
          <FlowBuilder
            tabs={tabs}
            onAdd={handleAdd}
            onConnect={handleConnect}
            loading={loading}
            nodesCreator={nodesCreator}
            nodesSelection={selection}
            nodeContentTitle="Step result"
            nodeKeyProperty="data.key"
            defaultNodeContent={nodeContent}
            readOnly
            title={
              <StyledStack direction="row" spacing={2} alignItems="center">
                <ReturnBtn />
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
              </StyledStack>
            }
            {...rest}
          />
        );
      }}
    />
  );
};
