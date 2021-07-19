import { Box, Paper } from '@material-ui/core';
import React, { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Connection,
  Edge,
  EdgeProps,
  NodeProps,
  ReactFlowProvider,
} from 'react-flow-renderer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  FlowBuilderHeader,
  FlowBuilderHeaderProps,
} from './Header/FlowBuilderHeader';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  CreateNodeResult,
  FlowBuilderAddApi,
  FlowBuilderItem,
  FlowBuilderRemoveApi,
  IsValidConnectionParams,
  NodeContentComponent,
  NodeMetadata,
  NodesCreatorApi,
} from './FlowBuilder.types';
import { FlowBuilderItemsProvider } from './providers/FlowBuilderItems.provider';
import {
  FlowBuilderTabs,
  FlowBuilderTabsProps,
  mainTab,
} from './Tabs/FlowBuilderTabs';
import { FlowBuilderContent } from './Content/FlowBuilderContent';
import { FlowBuilderActiveNodeProvider } from './providers/FlowBuilderActiveNode.provider';
import { FlowBuilderInstanceProvider } from './providers/FlowBuilderInstance.provider';
import { FlowBuilderSelectionProvider } from './providers/FlowBuilderSelection.provider';
import { nodeTypes } from './nodeTypes/nodeTypes';
import { FlowBuilderPropsProvider } from './providers/FlowBuilderProps.provider';
import { FlowBuilderDragStateProvider } from './providers/FlowBuilderDragState.provider';
import { Selection } from '@scrapper-gate/frontend/common';
import { FormUndoProvider } from '@scrapper-gate/frontend/form';

export interface FlowBuilderProps<
  T extends BaseNodeProperties = BaseNodeProperties,
  S extends BaseNodeSelectionProperties = BaseNodeSelectionProperties
> extends FlowBuilderHeaderProps,
    Pick<FlowBuilderTabsProps, 'tabs' | 'mainTabLabel'> {
  onAdd?: (
    item: Selection<S>,
    api: FlowBuilderAddApi<T>
  ) => CreateNodeResult<T> | Promise<CreateNodeResult<T>>;
  onRemove?: (
    nodes: Array<EdgeProps<T> | NodeProps<T>>,
    api: FlowBuilderRemoveApi<T>
  ) => FlowBuilderItem<T>[];
  onChange?: (items: FlowBuilderItem<T>[]) => unknown;
  nodesSelection?: Selection<S>[];
  nodeTypes?: Record<string, NodeMetadata<T>>;
  onConnect?: (connection: Connection, edge?: Partial<Edge<T>>) => Edge<T>;
  useFallbackConnectionHandler?: boolean;
  isValidConnection?: (params: IsValidConnectionParams<T>) => boolean;
  nodeContents?: Record<string, NodeContentComponent>;
  defaultNodeContent?: NodeContentComponent;
  isUsingElementPicker?: boolean;
  nodesLabel?: string;
  loading?: boolean;
  // Used on init in order to transform initial items into actual nodes
  nodesCreator?: (api: NodesCreatorApi<T, S>) => Promise<FlowBuilderItem<T>[]>;
  // Useful in testing, if set to sets data-items to current items on element .flow-builder-canvas
  renderItemsInDataAttribute?: boolean;
  // Path under which optional node key can be found - it will be displayed next to title
  nodeKeyProperty?: string;
}

const defaultNodeTypes = {};

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'all',
  },
}));

export const FlowBuilder = <
  T extends BaseNodeProperties = BaseNodeProperties,
  S extends BaseNodeSelectionProperties = BaseNodeSelectionProperties
>(
  props: FlowBuilderProps<T, S>
) => {
  const classes = useStyles();

  const {
    tabs,
    mainTabLabel,
    nodesSelection,
    nodeTypes: propsNodeTypes,
    ...rest
  } = props;

  const [activeTab, setActiveTab] = useState(mainTab);

  const tabContent = useMemo(() => {
    if (!tabs?.length || activeTab === mainTab) {
      return null;
    }

    return tabs.find((tab) => tab.value === activeTab)?.content;
  }, [activeTab, tabs]);

  const allNodeTypes = useMemo(
    () => ({
      ...(propsNodeTypes ?? defaultNodeTypes),
      ...nodeTypes,
    }),
    [propsNodeTypes]
  );

  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <FormUndoProvider>
          <FlowBuilderPropsProvider
            {...rest}
            activeTab={activeTab}
            nodeTypes={
              allNodeTypes as unknown as Record<string, NodeMetadata<T>>
            }
          >
            <FlowBuilderInstanceProvider>
              <FlowBuilderItemsProvider>
                <FlowBuilderSelectionProvider selection={nodesSelection}>
                  <FlowBuilderActiveNodeProvider>
                    <FlowBuilderDragStateProvider>
                      <Paper variant="outlined" className={classes.paper}>
                        <FlowBuilderHeader {...props} />
                        <FlowBuilderTabs
                          value={activeTab}
                          onChange={setActiveTab}
                          tabs={tabs}
                          mainTabLabel={mainTabLabel}
                        />
                        <Box flex={1} overflow="hidden">
                          {activeTab === mainTab && <FlowBuilderContent />}
                          {activeTab !== mainTab && tabContent}
                        </Box>
                      </Paper>
                    </FlowBuilderDragStateProvider>
                  </FlowBuilderActiveNodeProvider>
                </FlowBuilderSelectionProvider>
              </FlowBuilderItemsProvider>
            </FlowBuilderInstanceProvider>
          </FlowBuilderPropsProvider>
        </FormUndoProvider>
      </DndProvider>
    </ReactFlowProvider>
  );
};
