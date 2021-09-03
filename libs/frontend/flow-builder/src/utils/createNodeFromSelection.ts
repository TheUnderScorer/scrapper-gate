import { Selection } from '@scrapper-gate/frontend/common';
import { Node, XYPosition } from 'react-flow-renderer';
import { BaseNodeSelectionProperties } from '../FlowBuilder.types';

export const createNodeFromSelection = <S extends BaseNodeSelectionProperties>(
  id: string,
  selection: Selection<S>,
  position: XYPosition
): Node<Omit<S, 'type'>> => {
  return {
    id,
    position,
    data: {
      ...selection.value,
      icon: selection.icon,
      title: selection.label,
    },
    type: selection.value.type,
  };
};
