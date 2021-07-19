import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PlayArrow } from '@material-ui/icons';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';
import {
  VariablesProvider,
  VariablesTable,
} from '@scrapper-gate/frontend/domain/variables';
import {
  FormEditableText,
  joiValidationResolver,
  mergeValidators,
  useDebouncedValidator,
} from '@scrapper-gate/frontend/form';
import { logger } from '@scrapper-gate/shared/logger/console';
import { useUpdateScrapperMutation } from '@scrapper-gate/frontend/schema';
import {
  useSnackbarOnError,
  useSnackbarOnSuccess,
} from '@scrapper-gate/frontend/snackbars';
import {
  FlowBuilder,
  flowBuilderUtils,
  flowBuilderValidation,
  IsValidConnectionParams,
  NodeContentComponent,
} from '@scrapper-gate/frontend/ui';
import { extractVariableInput } from '@scrapper-gate/shared/domain/variables';
import { VariableScope } from '@scrapper-gate/shared/schema';
import { ScrapperBuilderDto } from '@scrapper-gate/shared/validation';
import React, { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { Node } from 'react-flow-renderer';
import { v4 as uuid } from 'uuid';
import { useRunScraperDialog } from '../RunScrapperDialog/useRunScraperDialog';
import { ScrapperBuilderNodeContent } from './NodeContent/ScrapperBuilderNodeContent';
import { nodesToScrapperSteps } from './nodesToScrapperSteps';
import {
  ScrapperBuilderFormState,
  ScrapperBuilderNode,
  ScrapperBuilderNodeProperties,
  ScrapperBuilderProps,
} from './ScrapperBuilder.types';
import { createScrapperNodeSelection } from './scrapperNodeSelection';
import { scrapperStepsToNodes } from './scrapperStepsToNodes';

const initialNodes = [
  flowBuilderUtils.createStartNode({
    x: 0,
    y: 0,
  }),
];

const handleConnect = flowBuilderUtils.basicHandleConnect();
const handleNodeRemoval = flowBuilderUtils.basicHandleRemoveNode();
const ensureCorrectSourcesCount =
  flowBuilderValidation.makeEnsureCorrectSourcesCount({
    allowedCount: 1,
    onConnect: handleConnect,
  });

const selection = createScrapperNodeSelection();

const useStyles = makeStyles(() => ({
  form: {
    width: '100%',
    height: '100%',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialVariables: any[] = [];

const tabs = [
  {
    label: 'Variables',
    value: 'variables',
    content: <VariablesTable scope={VariableScope.Scrapper} name="variables" />,
  },
];

export const ScrapperBuilder = ({
  browserUrl,
  loading,
  initialScrapper,
  ElementPicker,
  ...rest
}: ScrapperBuilderProps) => {
  const snackbarOnError = useSnackbarOnError();
  const snackbarOnSuccess = useSnackbarOnSuccess();

  const [updateScrapper, { data }] = useUpdateScrapperMutation();

  const [isUsingElementPicker] = useIsUsingElementPicker();

  const classes = useStyles();

  const ContentComponent: NodeContentComponent = useCallback(
    (props) => (
      <ScrapperBuilderNodeContent
        {...props}
        fieldNameCreator={props.getFieldName}
        ElementPicker={ElementPicker}
      />
    ),
    [ElementPicker]
  );

  const nodeCreationInterceptor = useCallback(
    (node: Node<ScrapperBuilderNodeProperties>) => {
      if (!node?.data?.url) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        node!.data!.url = browserUrl;
      }

      if (!node.data?.id) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        node.data!.id = node.id;
      }

      return node;
    },
    [browserUrl]
  );

  const handleAdd = useMemo(
    () =>
      flowBuilderUtils.basicHandleAddNode(
        () => uuid(),
        nodeCreationInterceptor
      ),
    [nodeCreationInterceptor]
  );

  const isConnectionValid = useCallback(
    (params: IsValidConnectionParams<ScrapperBuilderNodeProperties>) => {
      return (
        ensureCorrectSourcesCount.isValidConnectionChecker(params) &&
        flowBuilderValidation.ensureCorrectEdgeSourceTarget(params) &&
        !flowBuilderUtils.isNodeConnectedTo(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          params.connection.source!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          params.connection.target!,
          params.items
        )
      );
    },
    []
  );

  const validate = useMemo(
    () =>
      mergeValidators<ScrapperBuilderFormState>(
        (value) =>
          joiValidationResolver(ScrapperBuilderDto, {
            allowUnknown: true,
            presence: 'optional',
            context: {
              steps: value.items.map((item) => item.data),
              variables: value.variables,
            },
          })(value),
        flowBuilderValidation.ensureAllNodesAreConnected
      ),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedValidate = useDebouncedValidator<any>({
    validate,
    ms: 500,
  });

  const handleSubmit = useCallback(
    async (values: ScrapperBuilderFormState) => {
      if (!initialScrapper?.id) {
        return;
      }

      try {
        const steps = nodesToScrapperSteps(values.items);

        await updateScrapper({
          variables: {
            input: {
              id: initialScrapper.id,
              steps,
              name: values.name,
              variables: values.variables.map(extractVariableInput),
            },
          },
        });

        snackbarOnSuccess('Scrapper updated.');
      } catch (error) {
        logger.error(error);

        snackbarOnError(error);
      }
    },
    [initialScrapper, snackbarOnError, snackbarOnSuccess, updateScrapper]
  );

  const initialValues = useMemo<ScrapperBuilderFormState>(
    () => ({
      items: initialNodes as ScrapperBuilderNode[],
      name: initialScrapper?.name ?? '',
      variables: initialScrapper?.variables ?? initialVariables,
    }),
    [initialScrapper]
  );

  const nodesCreator = useMemo(
    () => scrapperStepsToNodes(initialScrapper?.steps ?? [], selection),
    [initialScrapper]
  );

  const runScrapperDialog = useRunScraperDialog({
    scrapper: initialScrapper ?? data?.updateScrapper,
  });

  return (
    <Form
      validate={debouncedValidate}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      destroyOnUnregister={false}
      render={(props) => (
        <VariablesProvider name="variables">
          <form className={classes.form} onSubmit={props.handleSubmit}>
            <FlowBuilder
              nodeKeyProperty="data.key"
              tabs={tabs}
              isUsingElementPicker={Boolean(isUsingElementPicker)}
              defaultNodeContent={ContentComponent}
              isValidConnection={isConnectionValid}
              onAdd={handleAdd}
              onRemove={handleNodeRemoval}
              onConnect={handleConnect}
              loading={loading}
              nodesSelection={selection}
              additionalActions={
                <IconButton onClick={() => runScrapperDialog()}>
                  <PlayArrow />
                </IconButton>
              }
              title={
                <FormEditableText
                  variant="standard"
                  name="name"
                  textProps={{ variant: 'h6' }}
                  onEditFinish={async (name) => {
                    if (!initialScrapper?.id) {
                      return;
                    }

                    await updateScrapper({
                      variables: {
                        input: {
                          id: initialScrapper.id,
                          name,
                        },
                      },
                    });
                  }}
                />
              }
              nodesCreator={nodesCreator}
              {...rest}
            />
          </form>
        </VariablesProvider>
      )}
    />
  );
};
