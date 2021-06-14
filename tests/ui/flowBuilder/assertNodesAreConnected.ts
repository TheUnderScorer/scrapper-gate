import { generateEdgeId } from '../../../libs/frontend/ui/src/organisms/FlowBuilder/utils';

export const assertNodesAreConnected = (
  sourceNodeId: string,
  targetNodeId: string,
  container?: HTMLElement
) => {
  const id = generateEdgeId(sourceNodeId, targetNodeId);

  const path = (container ?? document).querySelector(`#${id}`);

  return Boolean(path);
};
