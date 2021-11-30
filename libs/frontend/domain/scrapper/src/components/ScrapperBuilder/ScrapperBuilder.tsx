import { Fab, Stack, Tooltip, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';
import {
  FormVariablesProvider,
  VariablesTable,
} from '@scrapper-gate/frontend/domain/variables';
import {
  FlowBuilder,
  FlowBuilderNodeTypes,
  flowBuilderUtils,
  flowBuilderValidation,
  IsValidConnectionParams,
  NodeContentComponent,
} from '@scrapper-gate/frontend/flow-builder';
import {
  FormEditableText,
  ExposeFormState,
  joiValidationResolver,
  mergeValidators,
  setErrorMutator,
  UnsavedFormAlert,
  useDebouncedValidator,
} from '@scrapper-gate/frontend/form';
import { useUpdateScrapperMutation } from '@scrapper-gate/frontend/schema';
import {
  useSnackbarOnError,
  useSnackbarOnSuccess,
} from '@scrapper-gate/frontend/snackbars';
import { ReturnBtn } from '@scrapper-gate/frontend/ui';
import { isError } from '@scrapper-gate/shared/common';
import {
  ScrapperStepForVariable,
  variableFromScrapperStep,
} from '@scrapper-gate/shared/domain/scrapper';
import {
  createVariable,
  extractVariableInput,
} from '@scrapper-gate/shared/domain/variables';
import { logger } from '@scrapper-gate/shared/logger/console';
import { VariableScope } from '@scrapper-gate/shared/schema';
import React, { MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { Form } from 'react-final-form';
import { Node } from 'react-flow-renderer';
import { v4 as uuid } from 'uuid';
import { createScrapperNodeSelection } from '../../shared/scrapperNodeSelection';
import { scrapperStepsToNodes } from '../../shared/scrapperStepsToNodes';
import { useRunScraperDialog } from '../RunScrapperDialog/useRunScraperDialog';
import { ScrapperBuilderNodeContent } from './NodeContent/ScrapperBuilderNodeContent';
import { nodesToScrapperSteps } from './nodesToScrapperSteps';
import { ScrapperBuilderSchema } from './schema/ScrapperBuilder.schema';
import {
  ScrapperBuilderFormState,
  ScrapperBuilderNode,
  ScrapperBuilderNodeProperties,
  ScrapperBuilderProps,
} from './ScrapperBuilder.types';
import { ScrapperBuilderSettings } from './Settings/ScrapperBuilderSettings';
import { ScrapperBuilderStartNodeContent } from './StartNodeContent/ScrapperBuilderStartNodeContent';

const StyledForm = styled('form')({
  width: '100%',
  height: '100%',
});

const initialNodes = [
  flowBuilderUtils.createStartNode(
    {
      x: 0,
      y: 0,
    },
    false
  ),
];

const handleConnect = flowBuilderUtils.basicHandleConnect();
const handleNodeRemoval = flowBuilderUtils.basicHandleRemoveNode();
const ensureCorrectSourcesCount =
  flowBuilderValidation.makeEnsureCorrectSourcesCount({
    allowedCount: 1,
    onConnect: handleConnect,
  });

const selection = createScrapperNodeSelection();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialVariables: any[] = [];

const tabs = [
  {
    label: 'Variables',
    value: 'variables',
    content: <VariablesTable scope={VariableScope.Scrapper} name="variables" />,
  },
  {
    label: 'Settings',
    value: 'settings',
    content: <ScrapperBuilderSettings />,
  },
];

export const ScrapperBuilder = ({
  browserUrl,
  loading,
  initialScrapper,
  ElementPicker,
  CodeEditor,
  runUrlCreator,
  ...rest
}: ScrapperBuilderProps) => {
  const containerRef = useRef<HTMLFormElement>();

  const theme = useTheme();

  const snackbarOnError = useSnackbarOnError();
  const snackbarOnSuccess = useSnackbarOnSuccess();

  const [updateScrapper, { data }] = useUpdateScrapperMutation();

  const [isUsingElementPicker] = useIsUsingElementPicker();

  const ContentComponent: NodeContentComponent = useCallback(
    (props) => (
      <ScrapperBuilderNodeContent
        {...props}
        fieldNameCreator={props.getFieldName}
        ElementPicker={ElementPicker}
        CodeEditor={CodeEditor}
      />
    ),
    [CodeEditor, ElementPicker]
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
          joiValidationResolver(ScrapperBuilderSchema, {
            allowUnknown: true,
            presence: 'optional',
            context: {
              steps: value.items.map((item) => item.data),
              variables: [
                ...value.variables,
                value.items
                  .filter((item) => item?.data?.key && item?.data?.action)
                  .map((item) =>
                    createVariable(
                      variableFromScrapperStep(
                        item.data as ScrapperStepForVariable
                      )
                    )
                  ),
              ],
            },
          })(value),
        flowBuilderValidation.ensureAllNodesAreConnected
      ),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedValidate = useDebouncedValidator<any>({
    validate,
    ms: 200,
  });

  const handleSubmit = useCallback(
    async (values: ScrapperBuilderFormState) => {
      if (!initialScrapper?.id) {
        return;
      }

      const startNode = values.items.find(
        (node) => node.type === FlowBuilderNodeTypes.Start
      ) as Node | undefined;

      try {
        const steps = nodesToScrapperSteps(values.items);

        logger.debug(`Submit:`, {
          steps,
          values,
        });

        await updateScrapper({
          variables: {
            input: {
              id: initialScrapper.id,
              steps,
              name: values.name,
              // TODO Handle this on scalar level
              variables: values.variables.map(extractVariableInput),
              runSettings: values.runSettings,
              startNodePosition: startNode?.position,
            },
          },
        });

        snackbarOnSuccess('Scrapper updated.');
      } catch (error) {
        logger.error(error);

        if (isError(error)) {
          snackbarOnError(error);
        }
      }
    },
    [initialScrapper, snackbarOnError, snackbarOnSuccess, updateScrapper]
  );

  const initialValues = useMemo<ScrapperBuilderFormState>(
    () => ({
      items: initialNodes as ScrapperBuilderNode[],
      name: initialScrapper?.name ?? '',
      variables: initialScrapper?.variables ?? initialVariables,
      runSettings: initialScrapper?.runSettings,
    }),
    [initialScrapper]
  );

  const nodesCreator = useMemo(
    () =>
      scrapperStepsToNodes({
        steps: initialScrapper?.steps ?? [],
        selections: selection,
        startNodePosition: initialScrapper?.startNodePosition ?? undefined,
      }),
    [initialScrapper]
  );

  const runScrapperDialog = useRunScraperDialog({
    scrapper: initialScrapper ?? data?.updateScrapper,
    runUrlCreator,
  });

  return (
    <Form
      mutators={{ setError: setErrorMutator }}
      validate={debouncedValidate}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      destroyOnUnregister={false}
      render={(props) => (
        <FormVariablesProvider>
          <UnsavedFormAlert />
          <ExposeFormState targetRef={containerRef} />
          <StyledForm
            ref={containerRef as MutableRefObject<HTMLFormElement>}
            className="scrapper-builder-form"
            onSubmit={props.handleSubmit}
          >
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
              nodeContents={{
                [FlowBuilderNodeTypes.Start]: ScrapperBuilderStartNodeContent,
              }}
              additionalActions={
                <Tooltip title="Run scrapper">
                  <Fab
                    onClick={() => runScrapperDialog()}
                    size="small"
                    color="secondary"
                    sx={{
                      boxShadow: 'none',
                    }}
                  >
                    {theme.icons.run}
                  </Fab>
                </Tooltip>
              }
              title={
                <Stack alignItems="center" spacing={1} direction="row">
                  <ReturnBtn />
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
                </Stack>
              }
              nodesCreator={nodesCreator}
              {...rest}
            />
          </StyledForm>
        </FormVariablesProvider>
      )}
    />
  );
};
