import { makeStyles } from '@material-ui/core/styles';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';
import {
  VariablesProvider,
  VariablesTable,
} from '@scrapper-gate/frontend/domain/variables';
import {
  FormEditableText,
  joiValidationResolver,
  useDebouncedValidator,
  validatorsPipe,
} from '@scrapper-gate/frontend/form';
import { logger } from '@scrapper-gate/frontend/logger';
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
import { serializeValue } from '@scrapper-gate/shared/common';
import { VariableScope } from '@scrapper-gate/shared/schema';
import { ScrapperBuilderDto } from '@scrapper-gate/shared/validation';
import React, { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { Node } from 'react-flow-renderer';
import { omit } from 'remeda';
import { v4 as uuid } from 'uuid';
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
const ensureCorrectSourcesCount = flowBuilderValidation.makeEnsureCorrectSourcesCount(
  {
    allowedCount: 1,
    onConnect: handleConnect,
  }
);

const selection = createScrapperNodeSelection();

const useStyles = makeStyles(() => ({
  form: {
    width: '100%',
    height: '100%',
  },
}));

const initialVariables = [];

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

  const [updateScrapper] = useUpdateScrapperMutation();

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
      if (!node.data.url) {
        node.data.url = browserUrl;
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
          params.connection.source,
          params.connection.target,
          params.items
        )
      );
    },
    []
  );

  const validate = useMemo(
    () =>
      validatorsPipe<ScrapperBuilderFormState>(
        flowBuilderValidation.ensureAllNodesAreConnected,
        joiValidationResolver(ScrapperBuilderDto, {
          allowUnknown: true,
          presence: 'optional',
        })
      ),
    []
  );

  const debouncedValidate = useDebouncedValidator({
    validate,
    ms: 500,
  });

  const handleSubmit = useCallback(
    async (values: ScrapperBuilderFormState) => {
      try {
        const steps = nodesToScrapperSteps(values.items);

        await updateScrapper({
          variables: {
            input: {
              id: initialScrapper.id,
              steps,
              name: values.name,
              variables: values.variables.map((variable) => ({
                ...omit(variable, ['createdAt', 'updatedAt', 'isBuiltIn']),
                value: serializeValue(variable.value),
                defaultValue: serializeValue(variable.defaultValue),
              })),
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
      name: initialScrapper?.name,
      variables: initialScrapper?.variables ?? initialVariables,
    }),
    [initialScrapper]
  );

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
              tabs={tabs}
              isUsingElementPicker={isUsingElementPicker}
              defaultNodeContent={ContentComponent}
              isValidConnection={isConnectionValid}
              onAdd={handleAdd}
              onRemove={handleNodeRemoval}
              onConnect={handleConnect}
              loading={loading}
              nodesSelection={selection}
              title={
                <FormEditableText
                  variant="standard"
                  name="name"
                  textProps={{ variant: 'h6' }}
                  onEditFinish={async (name) => {
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
              nodesCreator={scrapperStepsToNodes(
                initialScrapper?.steps ?? [],
                selection
              )}
              {...rest}
            />
          </form>
        </VariablesProvider>
      )}
    />
  );
};
