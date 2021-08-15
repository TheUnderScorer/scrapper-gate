import { ExcludeFalsy, getById } from '@scrapper-gate/shared/common';
import { NodeLikeItem } from './types';

type FilterPaths = Array<
  keyof Pick<NodeLikeItem, 'nextStep' | 'stepOnFalse' | 'stepOnTrue'>
>;

export interface TravelNodeResult {
  newPaths?: FilterPaths;
}

interface TravelNodeLikeParams<T extends NodeLikeItem> {
  start: T;
  items: T[];
  direction: 'in' | 'out';
  callback: (item: T) => boolean | void | TravelNodeResult;
  // Object properties to use for finding related nodes
  filterPaths?: FilterPaths;
}

/**
 * Alternative to travelNodes that travels node like items in given direction
 *
 * @example
 * travelNodeLike(node, nodes, "in", node => {
 *   // Returning true ends travel
 *   return true;
 * })
 * */
export const travelNodeLike = <T extends NodeLikeItem>({
  start,
  items,
  direction,
  callback,
  filterPaths = ['nextStep', 'stepOnFalse', 'stepOnTrue'],
}: TravelNodeLikeParams<T>) => {
  const connectedNodes =
    direction === 'in'
      ? getIncoming(start, items, filterPaths)
      : getOutgoers(start, items, filterPaths);

  if (!connectedNodes.length) {
    return;
  }

  for (const connectedNode of connectedNodes) {
    const result = callback(connectedNode);

    if (result === true) {
      return;
    }

    const newFilterPaths =
      typeof result === 'object' && result.newPaths
        ? result.newPaths
        : filterPaths;

    travelNodeLike({
      start: connectedNode,
      items,
      direction,
      callback,
      filterPaths: newFilterPaths,
    });
  }
};

const getIncoming = <T extends NodeLikeItem>(
  item: T,
  items: T[],
  paths: FilterPaths
) =>
  items.filter((arrayItem) =>
    paths.some((path) => arrayItem[path]?.id === item.id)
  );

const getOutgoers = <T extends NodeLikeItem>(
  item: T,
  items: T[],
  paths: FilterPaths
) => {
  const result: Array<T | undefined> = [];

  paths.forEach((path) => {
    if (item[path]?.id) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.push(getById(items, item[path]!.id));
    }
  });

  return result.filter(ExcludeFalsy);
};
