import { Node, XYPosition } from 'react-flow-renderer';
import {
  BaseNodeProperties,
  FlowBuilderNodeTypes,
} from '@scrapper-gate/frontend/ui';
import { PlayArrowSharp } from '@material-ui/icons';
import React from 'react';

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
