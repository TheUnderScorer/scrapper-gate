import {
  BaseNodeProperties,
  FlowBuilderItem,
  FlowBuilderProps,
} from '../FlowBuilder.types';

export const basicHandleRemoveNode =
  (): FlowBuilderProps['onRemove'] =>
  (nodesToRemove, { items, removeElements }) => {
    return removeElements(
      nodesToRemove as FlowBuilderItem<BaseNodeProperties>[],
      items
    );
  };
