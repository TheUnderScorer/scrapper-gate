import { Box, Paper } from '@mui/material';
import { FormUndoProvider } from '@scrapper-gate/frontend/form';
import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ReactFlowProvider } from 'react-flow-renderer';
import { useMount } from 'react-use';
import { StringParam, useQueryParam } from 'use-query-params';
import { FlowBuilderContent } from './Content/FlowBuilderContent';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  FlowBuilderProps,
  NodeMetadata,
} from './FlowBuilder.types';
import { FlowBuilderHeader } from './Header/FlowBuilderHeader';
import { nodeTypes } from './nodeTypes/nodeTypes';
import { FlowBuilderActiveNodeProvider } from './providers/FlowBuilderActiveNode.provider';
import { FlowBuilderDragStateProvider } from './providers/FlowBuilderDragState.provider';
import { FlowBuilderInstanceProvider } from './providers/FlowBuilderInstance.provider';
import { FlowBuilderItemsProvider } from './providers/FlowBuilderItems.provider';
import { FlowBuilderPropsProvider } from './providers/FlowBuilderProps.provider';
import { FlowBuilderSelectionProvider } from './providers/FlowBuilderSelection.provider';
import { FlowBuilderTabs, mainTab } from './Tabs/FlowBuilderTabs';

const defaultNodeTypes = {};

export const FlowBuilder = <
  T extends BaseNodeProperties = BaseNodeProperties,
  S extends BaseNodeSelectionProperties = BaseNodeSelectionProperties
>(
  props: FlowBuilderProps<T, S>
) => {
  const {
    tabs,
    mainTabLabel,
    nodesSelection,
    nodeTypes: propsNodeTypes,
    apiRef,
    ...rest
  } = props;

  const [activeTab, setActiveTab] = useQueryParam('tab', StringParam);

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

  useMount(() => {
    if (!activeTab) {
      setActiveTab(mainTab);
    }
  });

  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <FormUndoProvider>
          <FlowBuilderPropsProvider
            {...rest}
            activeTab={activeTab ?? undefined}
            nodeTypes={
              allNodeTypes as unknown as Record<string, NodeMetadata<T>>
            }
          >
            <FlowBuilderInstanceProvider>
              <FlowBuilderItemsProvider>
                <FlowBuilderSelectionProvider selection={nodesSelection}>
                  <FlowBuilderActiveNodeProvider>
                    <FlowBuilderDragStateProvider>
                      <Paper
                        variant="outlined"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                          pointerEvents: 'all',
                        }}
                      >
                        <FlowBuilderHeader {...props} />
                        <FlowBuilderTabs
                          value={activeTab}
                          onChange={setActiveTab}
                          tabs={tabs}
                          mainTabLabel={mainTabLabel}
                        />
                        <Box flex={1} overflow="hidden">
                          {activeTab === mainTab && (
                            <FlowBuilderContent apiRef={apiRef} />
                          )}
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
