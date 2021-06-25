/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NodeLikeItem } from '@scrapper-gate/shared/schema';
import { Node } from 'react-flow-renderer';
import { recreateNodes } from './recreateNodes';
import { createEdge } from './createEdge';
import { createNodeFromSelection } from './createNodeFromSelection';
import { BaseNodeProperties, FlowBuilderNodeTypes } from '../FlowBuilder.types';

describe('Recreate nodes', () => {
  const baseItems: NodeLikeItem[] = [
    {
      id: '1',
      type: FlowBuilderNodeTypes.Action,
      position: {
        x: 0,
        y: 50,
      },
      nextStep: {
        id: '2',
      },
    },
    {
      id: '2',
      type: FlowBuilderNodeTypes.Conditional,
      position: {
        x: 0,
        y: 100,
      },
      previousSteps: [
        {
          id: '1',
        },
      ],
      stepOnFalse: {
        id: '3',
      },
      stepOnTrue: {
        id: '4',
      },
    },
    {
      id: '3',
      type: FlowBuilderNodeTypes.Action,
      position: {
        x: 0,
        y: 150,
      },
    },
    {
      id: '4',
      type: FlowBuilderNodeTypes.Action,
      position: {
        x: 0,
        y: 150,
      },
    },
  ];

  it('should recreate nodes', async () => {
    const result = await recreateNodes({
      items: baseItems,
      selections: [],
      findSelectionForItem: (item) => ({
        label: `Test item label ${item.id}`,
        value: {
          type: item.type!,
        },
      }),
    })({
      handleConnect: (params) =>
        createEdge({
          sourceId: params.source!,
          targetId: params.target!,
        }),
      createNode: async (selection) => [
        createNodeFromSelection(
          selection.value.id!,
          selection,
          selection.value.position!
        ) as Node<BaseNodeProperties>,
      ],
    });

    expect(result).toMatchInlineSnapshot(`
Array [
  Object {
    "data": Object {
      "icon": undefined,
      "id": "1",
      "nextStep": Object {
        "id": "2",
      },
      "position": Object {
        "x": 0,
        "y": 50,
      },
      "title": "Test item label 1",
      "type": "Action",
    },
    "id": "1",
    "position": Object {
      "x": 0,
      "y": 50,
    },
    "type": "Action",
  },
  Object {
    "data": Object {
      "icon": undefined,
      "id": "2",
      "position": Object {
        "x": 0,
        "y": 100,
      },
      "previousSteps": Array [
        Object {
          "id": "1",
        },
      ],
      "stepOnFalse": Object {
        "id": "3",
      },
      "stepOnTrue": Object {
        "id": "4",
      },
      "title": "Test item label 2",
      "type": "Conditional",
    },
    "id": "2",
    "position": Object {
      "x": 0,
      "y": 100,
    },
    "type": "Conditional",
  },
  Object {
    "data": Object {
      "icon": undefined,
      "id": "3",
      "position": Object {
        "x": 0,
        "y": 150,
      },
      "title": "Test item label 3",
      "type": "Action",
    },
    "id": "3",
    "position": Object {
      "x": 0,
      "y": 150,
    },
    "type": "Action",
  },
  Object {
    "data": Object {
      "icon": undefined,
      "id": "4",
      "position": Object {
        "x": 0,
        "y": 150,
      },
      "title": "Test item label 4",
      "type": "Action",
    },
    "id": "4",
    "position": Object {
      "x": 0,
      "y": 150,
    },
    "type": "Action",
  },
  Object {
    "data": Object {},
    "id": "e1-2",
    "source": "1",
    "target": "2",
  },
  Object {
    "data": Object {},
    "id": "e2-4",
    "source": "2",
    "target": "4",
  },
  Object {
    "data": Object {},
    "id": "e2-3",
    "source": "2",
    "target": "3",
  },
  Object {
    "data": Object {
      "cannotBeDeleted": true,
      "icon": <Memo />,
      "noContent": true,
      "title": "Start",
    },
    "id": "start",
    "position": Object {
      "x": -180,
      "y": 50,
    },
    "type": "Start",
  },
  Object {
    "data": Object {},
    "id": "estart-1",
    "source": "start",
    "target": "1",
  },
]
`);
  });
});
