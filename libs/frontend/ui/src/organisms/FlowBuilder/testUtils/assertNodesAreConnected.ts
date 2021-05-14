import { generateEdgeId } from '../utils';

export const assertNodesAreConnected = (
  sourceNodeId: string,
  targetNodeId: string,
  container?: HTMLElement
) => {
  const id = generateEdgeId(sourceNodeId, targetNodeId);

  const path = (container ?? document).querySelector(`#${id}`);

  return Boolean(path);
};
