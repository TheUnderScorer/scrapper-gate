import { Box, Paper } from '@material-ui/core';
import React, { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { ReactFlowProvider } from 'react-flow-renderer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  FlowBuilderHeader,
  FlowBuilderHeaderProps,
} from './flowBuilderHeader/FlowBuilderHeader';
import {
  BaseFlowBuilderProps,
  BaseNodeProperties,
  BaseNodeSelectionProperties,
} from './FlowBuilder.types';
import { FlowBuilderItemsProvider } from './providers/FlowBuilderItems.provider';
import {
  FlowBuilderTabs,
  FlowBuilderTabsProps,
  mainTab,
} from './flowBuilderTabs/FlowBuilderTabs';
import { FlowBuilderContent } from './flowBuilderContent/FlowBuilderContent';
import { FlowBuilderActiveNodeProvider } from './providers/FlowBuilderActiveNode.provider';
import { FlowBuilderInstanceProvider } from './providers/FlowBuilderInstance.provider';
import { FlowBuilderSelectionProvider } from './providers/FlowBuilderSelection.provider';
import { nodeTypes } from './nodeTypes/nodeTypes';
import { FlowBuilderPropsProvider } from './providers/FlowBuilderProps.provider';
import { FlowBuilderDragStateProvider } from './providers/FlowBuilderDragState.provider';

export interface FlowBuilderProps<
  T extends BaseNodeProperties = BaseNodeProperties,
  S extends BaseNodeSelectionProperties = BaseNodeSelectionProperties
> extends FlowBuilderHeaderProps,
    Pick<FlowBuilderTabsProps, 'tabs' | 'mainTabLabel'>,
    BaseFlowBuilderProps<T, S> {}

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

  const { tabs, mainTabLabel, nodesSelection, ...rest } = props;

  const [activeTab, setActiveTab] = useState(mainTab);

  const tabContent = useMemo(() => {
    if (!tabs?.length || activeTab === mainTab) {
      return null;
    }

    return tabs.find((tab) => tab.value === activeTab)?.content;
  }, [activeTab, tabs]);

  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <FlowBuilderPropsProvider
          {...rest}
          nodeTypes={{
            ...(rest.nodeTypes ?? defaultNodeTypes),
            ...nodeTypes,
          }}
        >
          <FlowBuilderInstanceProvider>
            <FlowBuilderItemsProvider>
              <FlowBuilderSelectionProvider selection={nodesSelection}>
                <FlowBuilderActiveNodeProvider>
                  <FlowBuilderDragStateProvider>
                    <Paper
                      elevation={1}
                      variant="outlined"
                      className={classes.paper}
                    >
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
      </DndProvider>
    </ReactFlowProvider>
  );
};