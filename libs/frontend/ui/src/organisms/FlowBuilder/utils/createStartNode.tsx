import { PlayArrowSharp } from '@material-ui/icons';
import React from 'react';
import { Node, XYPosition } from 'react-flow-renderer';
import { BaseNodeProperties, FlowBuilderNodeTypes } from '../FlowBuilder.types';

export const createStartNode = (
  position: XYPosition,
  noContent = true
): Node<BaseNodeProperties> => ({
  id: 'start',
  type: FlowBuilderNodeTypes.Start,
  position,
  data: {
    title: 'Start',
    cannotBeDeleted: true,
    icon: <PlayArrowSharp />,
    noContent,
  },
});
