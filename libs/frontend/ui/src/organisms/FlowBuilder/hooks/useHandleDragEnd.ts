import { MouseEvent, useCallback } from 'react';
import { isNode, Node } from 'react-flow-renderer';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderDragStateSelector } from '../providers/FlowBuilderDragState.provider';

export const useHandleDragEnd = () => {
  const setDraggedNode = useFlowBuilderDragStateSelector(
    (ctx) => ctx.setDraggedNode
  );
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);
  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);

  return useCallback(
    (event: MouseEvent, node: Node) => {
      event.preventDefault();

      setTimeout(() => setDraggedNode(undefined), 250);

      const newNodes = getItems().map((item) => {
        if (isNode(item) && item.id === node.id) {
          return {
            ...item,
            position: {
              ...node.position,
            },
          };
        }

        return item;
      });

      setItems(newNodes);
    },
    [getItems, setDraggedNode, setItems]
  );
};
