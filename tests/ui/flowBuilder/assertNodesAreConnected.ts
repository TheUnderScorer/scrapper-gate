import { generateEdgeId } from '../../../libs/frontend/flow-builder/src/utils';

export const assertNodesAreConnected = (
  sourceNodeId: string,
  targetNodeId: string,
  container?: HTMLElement
) => {
  const id = generateEdgeId(sourceNodeId, targetNodeId);

  const path = (container ?? document).querySelector(`#${id}`);

  return Boolean(path);
};
