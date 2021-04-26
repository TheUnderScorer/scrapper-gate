import React, { useCallback, useMemo } from 'react';
import { action } from '@storybook/addon-actions';
import {
  AccountTreeSharp,
  ArrowBack,
  CloseSharp,
  OpenInBrowserSharp,
  PlayArrowSharp,
  StopSharp,
  Visibility,
} from '@material-ui/icons';

import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { Box, Typography } from '@material-ui/core';
import {
  BaseNodeProperties,
  FlowBuilder,
  FlowBuilderNodeTypes,
  FlowBuilderPlaceholderProperties,
  NodeContentComponent,
  PrimaryLightIconButton,
} from '@scrapper-gate/frontend/ui';
import {
  basicHandleAddNode,
  basicHandleConnect,
  basicHandleRemoveNode,
} from './utils';
import { wait } from '@scrapper-gate/shared/common';
import { FormTextField } from '@scrapper-gate/frontend/form';

export default {
  title: 'UI/Flow Builder',
};

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

const NodeContent: NodeContentComponent<BaseNodeProperties> = ({
  getFieldName,
}) => {
  return (
    <Box width="100%">
      <FormTextField fullWidth name={getFieldName('title')} label="Title" />
    </Box>
  );
};

const nodeContents = {
  [FlowBuilderNodeTypes.Action]: NodeContent,
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
              <PrimaryLightIconButton size="small">
                <PlayArrowSharp />
              </PrimaryLightIconButton>
            }
          />
        </form>
      )}
    />
  );
};
