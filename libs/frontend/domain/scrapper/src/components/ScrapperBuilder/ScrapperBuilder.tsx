import React, { useCallback, useMemo } from 'react';
import {
  FlowBuilder,
  FlowBuilderFormState,
  flowBuilderUtils,
  flowBuilderValidation,
  IsValidConnectionParams,
  NodeContentComponent,
} from '@scrapper-gate/frontend/ui';
import { v4 as uuid } from 'uuid';
import {
  joiValidationResolver,
  useDebouncedValidator,
  validatorsPipe,
} from '@scrapper-gate/frontend/form';
import { createScrapperNodeSelection } from './scrapperNodeSelection';
import {
  ScrapperBuilderNodeProperties,
  ScrapperBuilderProps,
} from './ScrapperBuilder.types';
import { Node } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { ScrapperBuilderNodeContent } from './NodeContent/ScrapperBuilderNodeContent';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';
import { nodesToScrapperSteps } from './nodesToScrapperSteps';
import { useUpdateScrapperMutation } from '@scrapper-gate/frontend/schema';
import { scrapperStepsToNodes } from './scrapperStepsToNodes';
import { ScrapperBuilderDto } from '@scrapper-gate/shared/validation';
import { logger } from '@scrapper-gate/frontend/logger';
import {
  useSnackbarOnError,
  useSnackbarOnSuccess,
} from '@scrapper-gate/frontend/snackbars';

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
      validatorsPipe<FlowBuilderFormState<ScrapperBuilderNodeProperties>>(
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
    ms: 1000,
  });

  const handleSubmit = useCallback(
    async (values: FlowBuilderFormState<ScrapperBuilderNodeProperties>) => {
      try {
        const steps = nodesToScrapperSteps(values.items);

        await updateScrapper({
          variables: {
            input: {
              id: initialScrapper.id,
              steps,
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

  return (
    <Form
      validate={debouncedValidate}
      onSubmit={handleSubmit}
      initialValues={{
        items: initialNodes,
      }}
      destroyOnUnregister={false}
      render={(props) => (
        <form className={classes.form} onSubmit={props.handleSubmit}>
          <FlowBuilder
            isUsingElementPicker={isUsingElementPicker}
            defaultNodeContent={ContentComponent}
            isValidConnection={isConnectionValid}
            onAdd={handleAdd}
            onRemove={handleNodeRemoval}
            onConnect={handleConnect}
            loading={loading}
            nodesSelection={selection}
            title={initialScrapper?.name ?? 'Unnamed scrapper'}
            nodesCreator={scrapperStepsToNodes(
              initialScrapper?.steps ?? [],
              selection
            )}
            {...rest}
          />
        </form>
      )}
    />
  );
};
