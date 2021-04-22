import {
  BaseNodeProperties,
  FlowBuilderItem,
  FlowBuilderNodeTypes,
} from '../FlowBuilder.types';
import { splitNodesAndEdges } from './splitNodesAndEdges';
import { findFirstNodeEdge } from './findFirstNodeEdge';

const items: FlowBuilderItem<BaseNodeProperties>[] = [
  {
    id: '2',
    position: { x: 100, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  {
    id: '3',
    position: { x: 100, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  {
    id: 'placeholder',
    position: { x: 100, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  {
    id: '1',
    position: { x: 100, y: 125 },
    type: FlowBuilderNodeTypes.Action,
  },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'placeholder-edge', source: '3', target: 'placeholder' },
  { id: 'e1-2', source: '1', target: '2' },
];

describe('Find first node and edge', () => {
  it('should find first node and edge', () => {
    const { edge, node } = findFirstNodeEdge(splitNodesAndEdges(items));

    expect(node.id).toEqual('1');
    expect(edge.id).toEqual('e1-2');
  });
});
