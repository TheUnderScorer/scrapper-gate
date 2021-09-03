import { FlowBuilderEdgeTypes } from '../FlowBuilder.types';
import { NormalEdge } from './NormalEdge';

export const edgeTypes = {
  [FlowBuilderEdgeTypes.Normal]: NormalEdge,
};
