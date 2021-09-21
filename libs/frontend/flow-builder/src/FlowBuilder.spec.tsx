/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AccountTreeSharp,
  OpenInBrowserSharp,
  PetsSharp,
  SaveSharp,
  StopSharp,
} from '@mui/icons-material';
import { QueryParamProvider, Selection } from '@scrapper-gate/frontend/common';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { wait } from '@scrapper-gate/shared/common';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router';
import { dragSelectionIntoCanvas } from '../../../../tests/ui/flowBuilder/dragSelectionIntoCanvas';
import { FlowBuilder } from './FlowBuilder';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  FlowBuilderProps,
  NodeContentComponent,
} from './FlowBuilder.types';
import { createNodeFromSelection } from './utils/createNodeFromSelection';

const offset = 50;

const firstNodeOnClick = jest.fn();
const handleSubmit = jest.fn();

const defaultInitialItems: FlowBuilderItem<BaseNodeProperties>[] = [
  {
    id: '1',
    data: {
      title: 'First element',
      isFirst: true,
      icon: <OpenInBrowserSharp />,
      onClick: firstNodeOnClick,
      nextNodeId: '2',
    },
    position: { x: 100, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  {
    id: '2',
    data: {
      title: 'Second element',
      icon: <PetsSharp />,
      prevNodeId: '1',
      nextNodeId: '3',
    },
    position: { x: 100 + offset, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  {
    id: '3',
    data: {
      title: 'Third element',
      icon: <SaveSharp />,
      nextNodeId: 'placeholder',
      prevNodeId: '2',
    },
    position: { x: 100 + offset * 2, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

const nodesSelection: Selection<BaseNodeSelectionProperties>[] = [
  {
    icon: <OpenInBrowserSharp />,
    label: 'Open in browser',
    value: {
      type: FlowBuilderNodeTypes.Action,
      dropdownMenu: (node) => [
        {
          id: 'test',
          content: `Custom item (node #${node.id})`,
        },
      ],
    },
  },
  {
    icon: <AccountTreeSharp />,
    label: 'Conditional',
    value: {
      type: FlowBuilderNodeTypes.Conditional,
      onClick: (node) => {
        alert(`Clicked ${node.id}`);
      },
    },
  },
  {
    icon: <StopSharp />,
    label: 'End',
    value: {
      type: FlowBuilderNodeTypes.End,
    },
  },
];

const renderComponent = ({
  initialItems = defaultInitialItems,
  ...flowBuilderProps
}: Partial<FlowBuilderProps> & {
  initialItems?: FlowBuilderItem<BaseNodeProperties>[];
} = {}) =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <QueryParamProvider>
          <Form
            onSubmit={handleSubmit}
            initialValues={{
              items: initialItems,
            }}
            render={(props) => (
              <form
                style={{
                  width: 500,
                  height: 500,
                }}
                onSubmit={props.handleSubmit}
              >
                <FlowBuilder
                  nodesSelection={nodesSelection}
                  {...flowBuilderProps}
                />
              </form>
            )}
          />
        </QueryParamProvider>
      </MemoryRouter>
    </ThemeProvider>
  );

const withConditionalNode = async () => {
  const ContentComponent: NodeContentComponent = ({ nodeIndex }) => {
    return <span>Test content of node {nodeIndex}</span>;
  };

  const items: FlowBuilderItem<BaseNodeProperties>[] = [
    ...defaultInitialItems,
    {
      id: 'test',
      type: FlowBuilderNodeTypes.Conditional,
      data: {
        title: 'Test',
      },
      position: { x: 100, y: 200 },
    },
  ];

  const cmp = renderComponent({
    initialItems: items,
    nodeContents: {
      [FlowBuilderNodeTypes.Conditional]: ContentComponent,
    },
    onRemove: jest.fn(),
  });

  await wait(500);

  const node = cmp.container.querySelector(
    `.flow-builder-node-${FlowBuilderNodeTypes.Conditional} .conditional-node`
  );

  act(() => {
    userEvent.dblClick(node!);
  });

  await wait(450);

  return {
    cmp,
    node,
    id: node!.parentElement!.parentElement!.id.replace('node-', ''),
  };
};

describe('<FlowBuilder />', () => {
  const onAdd = jest.fn((selection, { position, items }) => {
    const node = createNodeFromSelection('#new_node', selection, position);

    return {
      items,
      createdNodes: [node],
    };
  });

  beforeEach(() => {
    handleSubmit.mockClear();
    firstNodeOnClick.mockClear();
    onAdd.mockClear();
  });

  it('should render without crashing', () => {
    const cmp = renderComponent();

    expect(cmp).toMatchSnapshot();
  });

  it('should support custom tabs', () => {
    renderComponent({
      tabs: [
        {
          label: 'Tab 1',
          content: <span>Tab 1 content</span>,
          value: 'tab_1',
        },
      ],
    });

    const tab = screen.getByText('Tab 1');

    act(() => {
      userEvent.click(tab as HTMLElement);
    });

    const tabContent = screen.getByText('Tab 1 content');

    expect(tabContent).toBeInTheDocument();
  });

  it('should add new items that are dragged into canvas and then undo and redo it', async () => {
    const cmp = renderComponent({
      onAdd,
    });

    const canvas = cmp.container.querySelector<HTMLDivElement>(
      '.flow-builder-canvas'
    );
    const selection = cmp.container.querySelector<HTMLDivElement>(
      `.item-${FlowBuilderNodeTypes.Action}`
    );

    dragSelectionIntoCanvas(selection!, canvas!);

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));

    let nodes = cmp.container.querySelectorAll('.flow-builder-node');

    expect(nodes).toHaveLength(4);

    await wait(500);

    const undoBtn = cmp.container.querySelector('.undo-btn');

    act(() => {
      userEvent.click(undoBtn!);
    });

    nodes = cmp.container.querySelectorAll('.flow-builder-node');

    expect(nodes).toHaveLength(3);

    const redoBtn = cmp.container.querySelector('.redo-btn');

    await wait(500);

    act(() => {
      userEvent.click(redoBtn!);
    });

    nodes = cmp.container.querySelectorAll('.flow-builder-node');

    expect(nodes).toHaveLength(4);
  });

  it('should render node content after clicking it', async () => {
    await withConditionalNode();

    expect(screen.getByText('Test content of node 5')).toBeInTheDocument();
  });

  it('should add new items via context menu', async () => {
    const cmp = renderComponent({
      onAdd,
    });
    const canvas = cmp.container.querySelector('.flow-builder-canvas');

    act(() => {
      fireEvent.contextMenu(canvas!, {
        clientY: 50,
        clientX: 50,
      });
    });

    const contextMenu = document.querySelector('.context-menu');
    const [item] = screen
      .getAllByText('Open in browser')
      .filter((item) => contextMenu!.contains(item))
      .map((item) => item!.parentElement!.parentElement);

    act(() => {
      userEvent.click(item!);
    });

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][1].position.x).toEqual(49);
    expect(onAdd.mock.calls[0][0].label).toEqual('Open in browser');
  });

  it('should close active node if it was removed', async () => {
    const { cmp, node, id } = await withConditionalNode();

    act(() => {
      userEvent.click(
        node!.parentElement!.querySelector('.node-dropdown-trigger')!
      );
    });

    await wait(100);

    act(() => {
      userEvent.click(cmp.baseElement.querySelector(`#delete-step-${id}`)!);
    });

    await wait(500);

    expect(
      cmp.container.querySelector('.node-content-panel')
    ).not.toBeInTheDocument();
  });
});
