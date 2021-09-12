import { mapToArray, wordFormByNumber } from '@scrapper-gate/shared/common';
import { Edge } from 'react-flow-renderer';
import {
  BaseNodeProperties,
  FlowBuilderFormState,
  FlowBuilderItem,
  FlowBuilderProps,
  IsValidConnectionParams,
} from '../FlowBuilder.types';
import { splitNodesAndEdges } from '../utils/splitNodesAndEdges';

export interface EnsureCorrectSourcesCountProps {
  // Map of NodeType -> Allowed sources count
  nodeTypeSourceCountMap?: Record<string, number>;
  // If nodeTypeSourceCountMap is empty, this prop will be used
  allowedCount: number;
  onConnect: FlowBuilderProps['onConnect'];
}

const generateSourceKey = (edge: Edge<BaseNodeProperties>) =>
  `${edge.source}-${edge.data?.sourceHandle}`;

const getInvalidEdges = (
  items: FlowBuilderItem<BaseNodeProperties>[],
  { allowedCount, nodeTypeSourceCountMap }: EnsureCorrectSourcesCountProps
) => {
  const nodeEdges = splitNodesAndEdges(items);

  const sourcesCount = new Map<string, number>();

  const getAllowedCountForType = (type: string) => {
    return nodeTypeSourceCountMap?.[type] ?? allowedCount;
  };

  const invalidEdges = mapToArray(nodeEdges.edges).filter((edge) => {
    const key = generateSourceKey(edge);

    if (!sourcesCount.has(key)) {
      sourcesCount.set(key, 1);

      return false;
    }

    const count = (sourcesCount.get(key) ?? 0) + 1;
    const node = nodeEdges.nodes.get(edge.source);
    const allowedSourcesCount = getAllowedCountForType(node?.type ?? '');

    sourcesCount.set(key, count);

    return count > allowedSourcesCount && count > 0;
  });

  return {
    invalidEdges,
    nodeEdges,
    getAllowedCountForType,
  };
};

export const makeEnsureCorrectSourcesCount = (
  props: EnsureCorrectSourcesCountProps
) => {
  return {
    validator: ({ items }: FlowBuilderFormState) => {
      const { invalidEdges, nodeEdges, getAllowedCountForType } =
        getInvalidEdges(items, props);

      if (invalidEdges.length) {
        return {
          invalidNodes: invalidEdges.reduce<Record<string, Error>>(
            (acc, edge) => {
              const node = nodeEdges.nodes.get(edge.source);
              const limit = getAllowedCountForType(node?.type ?? '');

              acc[edge.source] = new Error(
                wordFormByNumber(
                  'This node can have only one source connection.',
                  `This node can have only ${limit} source connections.`,
                  limit
                )
              );

              return acc;
            },
            {}
          ),
        };
      }

      return {};
    },
    isValidConnectionChecker: ({
      connection,
      items,
    }: IsValidConnectionParams<BaseNodeProperties>) => {
      if (!props.onConnect) {
        return true;
      }

      const mockEdge = props.onConnect(connection);

      const { invalidEdges } = getInvalidEdges([...items, mockEdge], props);

      return !invalidEdges.length;
    },
  };
};
