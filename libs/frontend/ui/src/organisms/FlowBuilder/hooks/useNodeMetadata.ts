import { BaseNodeProperties, NodeMetadata } from '../FlowBuilder.types';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

export const useNodeMetadata = <
  T extends BaseNodeProperties = BaseNodeProperties
>(
  type: string
) => {
  const nodeTypes = useFlowBuilderContextSelector((ctx) => ctx.nodeTypes);

  const metaData = nodeTypes?.[type];

  if (!metaData) {
    throw new TypeError(`Unable to find metadata for node ${type}`);
  }

  return (metaData as unknown) as NodeMetadata<T>;
};
