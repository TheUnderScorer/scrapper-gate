import { Node, XYPosition } from 'react-flow-renderer';
import { PlayArrowSharp } from '@material-ui/icons';
import React from 'react';
import { BaseNodeProperties, FlowBuilderNodeTypes } from '../FlowBuilder.types';

export const createStartNode = (
  position: XYPosition
): Node<BaseNodeProperties> => ({
  id: 'start',
  type: FlowBuilderNodeTypes.Start,
  position,
  data: {
    title: 'Start',
    cannotBeDeleted: true,
    icon: <PlayArrowSharp />,
    noContent: true,
  },
});
