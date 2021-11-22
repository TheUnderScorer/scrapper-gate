import {
  AccountTreeSharp,
  ArrowBack,
  CloseSharp,
  OpenInBrowserSharp,
  PlayArrowSharp,
  StopSharp,
  Visibility,
} from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { FormTextField } from '@scrapper-gate/frontend/form';
import { wait } from '@scrapper-gate/shared/common';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { FORM_ERROR } from 'final-form';
import React, { useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router';
import { FlowBuilder } from './FlowBuilder';
import {
  FlowBuilderNodeTypes,
  FlowBuilderPlaceholderProperties,
  NodeContentComponent,
} from './FlowBuilder.types';
import {
  basicHandleAddNode,
  basicHandleConnect,
  basicHandleRemoveNode,
} from './utils';

export default {
  title: 'UI/Flow Builder',
  component: FlowBuilder,
} as Meta;

const handleAddNode = basicHandleAddNode(() => new Date().toISOString());

const initialState = [
  {
    id: 'start',
    position: {
      x: 0,
      y: 0,
    },
    data: {
      title: 'Start',
      isFirst: true,
      cannotBeDeleted: true,
      icon: <PlayArrowSharp />,
    },
    type: FlowBuilderNodeTypes.Start,
  },
];

const handleBasicRemoveNode = basicHandleRemoveNode();
const basicConnect = basicHandleConnect();

const NodeContent: NodeContentComponent = ({ getFieldName }) => {
  return (
    <Box width="100%">
      <FormTextField fullWidth name={getFieldName('title')} label="Title" />
    </Box>
  );
};

const nodeContents = {
  [FlowBuilderNodeTypes.Action]: NodeContent,
};

export const Loading = () => {
  return (
    <MemoryRouter>
      <QueryParamProvider>
        <Form
          initialValues={{
            items: [],
          }}
          onSubmit={console.log}
          render={() => (
            <Box width="90vw" height="90vh">
              <FlowBuilder loading nodeTypes={{}} nodesSelection={[]} />
            </Box>
          )}
        />
      </QueryParamProvider>
    </MemoryRouter>
  );
};

export const BasicPreset = () => {
  const handleSubmit = useCallback(async () => {
    await wait(5000);

    return {
      [FORM_ERROR]: 'Test error',
    };
  }, []);

  const nodesSelection = useMemo(
    () => [
      {
        icon: <OpenInBrowserSharp />,
        label: 'Open in browser',
        value: {
          type: FlowBuilderNodeTypes.Action,
        },
      },
      {
        icon: <ArrowBack />,
        label: 'Go back',
        value: {
          type: FlowBuilderNodeTypes.Action,
        },
      },
      {
        icon: <Visibility />,
        label: 'Read text',
        value: {
          type: FlowBuilderNodeTypes.Action,
        },
      },
      {
        icon: <CloseSharp />,
        label: 'Finish scrapper',
        value: {
          type: FlowBuilderNodeTypes.Action,
        },
      },
      {
        icon: <AccountTreeSharp />,
        label: 'Conditional',
        value: {
          type: FlowBuilderNodeTypes.Conditional,
        },
      },
      {
        icon: <StopSharp />,
        label: 'End',
        value: {
          type: FlowBuilderNodeTypes.End,
        },
      },
    ],
    []
  );

  return (
    <MemoryRouter>
      <QueryParamProvider>
        <Form
          onSubmit={handleSubmit}
          initialValues={{
            items: initialState,
          }}
          render={(props) => (
            <form
              onSubmit={props.handleSubmit}
              style={{
                height: '90vh',
                width: '90vw',
              }}
            >
              <FlowBuilder<FlowBuilderPlaceholderProperties>
                nodeKeyProperty="data.title"
                nodesSelection={nodesSelection}
                nodesLabel="Steps"
                onAdd={handleAddNode}
                tabs={[
                  {
                    value: 'tab_1',
                    label: 'Tab 1',
                    content: <Typography>Tab 1 content</Typography>,
                  },
                  {
                    value: 'tab_2',
                    label: 'Tab 2',
                    content: <Typography>Tab 2 content</Typography>,
                  },
                ]}
                menu={[
                  {
                    id: 'item_1',
                    content: 'Item 1',
                  },
                  {
                    id: 'item_2',
                    content: 'Item 2',
                  },
                ]}
                title="Flow Builder"
                onClose={action('Close')}
                onRemove={handleBasicRemoveNode}
                onConnect={basicConnect}
                nodeContents={nodeContents}
                additionalActions={
                  <IconButton color="primaryLight" size="small">
                    <PlayArrowSharp />
                  </IconButton>
                }
              />
            </form>
          )}
        />
      </QueryParamProvider>
    </MemoryRouter>
  );
};
