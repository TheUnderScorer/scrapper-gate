import { FlowBuilderProps } from '../FlowBuilder';
import { BaseNodeProperties, FlowBuilderItem } from '../FlowBuilder.types';

export const basicHandleRemoveNode = (): FlowBuilderProps['onRemove'] => (
  nodesToRemove,
  { items, removeElements }
) => {
  return removeElements(
    nodesToRemove as FlowBuilderItem<BaseNodeProperties>[],
    items
  );
};
