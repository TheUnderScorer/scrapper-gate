import {
  AccountTreeSharp,
  OpenInBrowserSharp,
  PetsSharp,
  SaveSharp,
  StopSharp,
} from '@material-ui/icons';
import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  FormProvider,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';

import userEvent from '@testing-library/user-event';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  NodeContentComponent,
} from './FlowBuilder.types';
import { Selection } from '@scrapper-gate/frontend/common';
import { FlowBuilder, FlowBuilderProps } from './FlowBuilder';
import { createNodeFromSelection } from './utils/createNodeFromSelection';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { wait } from '@scrapper-gate/shared/common';

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
          content: ` Custom item (node #${node.id})`,
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

const Form = ({
  children,
  ...props
}: UseFormProps & { children: (form: UseFormReturn) => JSX.Element }) => {
  const form = useForm(props);

  return <FormProvider {...form}>{children(form)}</FormProvider>;
};

const renderComponent = ({
  initialItems = defaultInitialItems,
  ...flowBuilderProps
}: Partial<FlowBuilderProps> & {
  initialItems?: FlowBuilderItem<BaseNodeProperties>[];
} = {}) => {
  return render(
    <ThemeProvider>
      <Form
        defaultValues={{
          items: initialItems,
        }}
      >
        {(props) => (
          <form
            style={{
              width: 500,
              height: 500,
            }}
            onSubmit={props.handleSubmit(handleSubmit)}
          >
            <FlowBuilder
              nodesSelection={nodesSelection}
              {...flowBuilderProps}
            />
          </form>
        )}
      </Form>
    </ThemeProvider>
  );
};

const dragSelectionIntoCanvas = (
  selection: HTMLElement,
  canvas: HTMLElement
) => {
  fireEvent.dragStart(selection);
  fireEvent.dragEnter(canvas);
  fireEvent.dragOver(canvas);
  fireEvent.drop(canvas);
};

describe('<FlowBuilder />', () => {
  beforeEach(() => {
    handleSubmit.mockClear();
    firstNodeOnClick.mockClear();
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

    const tab = screen.getByText('Tab 1').parentNode;

    act(() => {
      userEvent.click(tab as HTMLElement);
    });

    const tabContent = screen.getByText('Tab 1 content');

    expect(tabContent).toBeInTheDocument();
  });

  it('should add new items that are dragged into canvas and then undo and redo it', async () => {
    const onAdd: FlowBuilderProps['onAdd'] = jest.fn(
      (selection, { position, items }) => {
        const node = createNodeFromSelection('#new_node', selection, position);

        return {
          items,
          createdNodes: [node],
        };
      }
    );

    const cmp = renderComponent({
      onAdd,
    });

    const canvas = cmp.container.querySelector<HTMLDivElement>(
      '.flow-builder-canvas'
    );
    const selection = cmp.container.querySelector<HTMLDivElement>(
      `.item-${FlowBuilderNodeTypes.Action}`
    );

    dragSelectionIntoCanvas(selection, canvas);

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));

    let nodes = cmp.container.querySelectorAll('.flow-builder-node');

    expect(nodes).toHaveLength(4);

    await wait(500);

    const undoBtn = cmp.container.querySelector('.undo-btn');

    act(() => {
      userEvent.click(undoBtn);
    });

    nodes = cmp.container.querySelectorAll('.flow-builder-node');

    expect(nodes).toHaveLength(3);

    const redoBtn = cmp.container.querySelector('.redo-btn');

    await wait(500);

    act(() => {
      userEvent.click(redoBtn);
    });

    nodes = cmp.container.querySelectorAll('.flow-builder-node');

    expect(nodes).toHaveLength(4);
  });

  it('should render node content after clicking it', async () => {
    const ContentComponent: NodeContentComponent<BaseNodeProperties> = ({
      node,
    }) => <span>Test content of node {node.id}</span>;

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
    });

    await wait(500);

    const node = cmp.container.querySelector(
      `.flow-builder-node-${FlowBuilderNodeTypes.Conditional} .conditional-node`
    );

    act(() => {
      userEvent.click(node);
    });

    await wait(450);

    expect(screen.getByText('Test content of node test')).toBeInTheDocument();
  });
});
