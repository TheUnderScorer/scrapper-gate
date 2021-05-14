import { graphlib, layout } from 'dagre';
import { Edge, isNode, Node } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';

export const getBasicNodeSize = () => ({
  width: 100,
  height: 100,
});

export const removeGraphEdge = (graph: graphlib.Graph, edge: Edge) => {
  return graph.removeEdge(edge.source, edge.target);
};

export const addNodeToGraph = (graph: graphlib.Graph, item: Node) => {
  graph.setNode(item.id, {
    ...getBasicNodeSize(),
    label: item.id,
  });
};

export const addEdgeToGraph = (graph: graphlib.Graph, item: Edge) => {
  graph.setEdge(item.source, item.target, {
    label: item.id,
  });
};

export const setGraphItems = (
  items: FlowBuilderItem<BaseNodeProperties>[],
  graph: graphlib.Graph
) => {
  items.forEach((item) => {
    if (isNode(item)) {
      addNodeToGraph(graph, item);
    } else {
      addEdgeToGraph(graph, item);
    }
  });
};

export const buildBasicGraph = (
  items: FlowBuilderItem<BaseNodeProperties>[]
) => {
  const graph = new graphlib.Graph({
    compound: true,
    directed: true,
  });

  graph
    .setDefaultEdgeLabel(() => ({}))
    .setGraph({
      rankdir: 'LR',
      ranker: 'tight-tree',
      nodesep: 300,
    });

  setGraphItems(items, graph);

  layout(graph);

  const positionedItems = applyLayout(items, graph);

  return {
    graph,
    items: positionedItems,
  };
};

export const applyLayout = <T extends BaseNodeProperties>(
  items: FlowBuilderItem<T>[],
  graph: graphlib.Graph
) => {
  return items.map((item) => {
    if (!isNode(item)) {
      return item;
    }

    const graphNode = graph.node(item.id);

    return {
      ...item,
      position: {
        x: graphNode.x,
        y: graphNode.y,
      },
    };
  });
};
