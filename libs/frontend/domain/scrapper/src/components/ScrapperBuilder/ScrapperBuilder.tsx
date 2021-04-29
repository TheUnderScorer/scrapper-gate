import React, { useCallback, useMemo } from 'react';
import {
  BaseNodeProperties,
  FlowBuilder,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  flowBuilderUtils,
  flowBuilderValidation,
  IsValidConnectionParams,
  NodeContentComponent,
} from '@scrapper-gate/frontend/ui';
import { v4 as uuid } from 'uuid';
import { validatorsPipe } from '@scrapper-gate/frontend/form';
import { createScrapperNodeSelection } from './scrapperNodeSelection';
import {
  ScrapperBuilderNodeProperties,
  ScrapperBuilderProps,
} from './ScrapperBuilder.types';
import { Node } from 'react-flow-renderer';
import { MouseButton } from '@scrapper-gate/shared/schema';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { PlayArrowSharp } from '@material-ui/icons';
import { ScrapperBuilderNodeContent } from './NodeContent/ScrapperBuilderNodeContent';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';

const initialNodes: FlowBuilderItem<BaseNodeProperties>[] = [
  {
    id: 'start',
    type: FlowBuilderNodeTypes.Start,
    position: {
      x: 0,
      y: 0,
    },
    data: {
      title: 'Start',
      cannotBeDeleted: true,
      icon: <PlayArrowSharp />,
      noContent: true,
    },
  },
];

const handleConnect = flowBuilderUtils.basicHandleConnect();
const handleNodeRemoval = flowBuilderUtils.basicHandleRemoveNode();
const ensureCorrectSourcesCount = flowBuilderValidation.makeEnsureCorrectSourcesCount(
  {
    allowedCount: 1,
    onConnect: handleConnect,
  }
);

const validate = validatorsPipe(
  flowBuilderValidation.ensureAllNodesAreConnected
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
  onClose,
}: ScrapperBuilderProps) => {
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
      node.data.url = browserUrl;
      node.data.mouseButton = MouseButton.Left;
      node.data.clickTimes = 1;

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

  return (
    <Form
      validate={validate}
      onSubmit={console.log}
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
            onClose={onClose}
          />
        </form>
      )}
    />
  );
};
