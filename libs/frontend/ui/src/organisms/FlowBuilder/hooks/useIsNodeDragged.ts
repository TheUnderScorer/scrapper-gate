import { useFlowBuilderDragStateSelector } from '../providers/FlowBuilderDragState.provider';

export const useIsNodeDragged = (nodeId: string) => {
  const draggedNode = useFlowBuilderDragStateSelector((ctx) => ctx.draggedNode);

  return draggedNode?.id === nodeId;
};
