import { Handle, Position } from 'react-flow-renderer';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BaseNodeProperties, HandleBag } from '../../FlowBuilder.types';
import { stopPropagation } from '@scrapper-gate/frontend/common';

export type ConditionalNodeHandlesProps = HandleBag<BaseNodeProperties>;

const useStyles = makeStyles(() => ({
  left: {
    left: '-16px',
  },
  top: {
    top: '-16px',
    marginLeft: '-5px',
  },
  bottom: {
    bottom: '-16px',
    marginLeft: '-5px',
  },
}));

export const ConditionalNodeHandles = ({
  isValidConnectionChecker,
}: ConditionalNodeHandlesProps) => {
  const classes = useStyles();

  return (
    <>
      <Handle
        onClick={stopPropagation}
        type="target"
        position={Position.Left}
        id={Position.Left}
        isValidConnection={isValidConnectionChecker}
        className={classes.left}
      />
      <Handle
        onClick={stopPropagation}
        type="source"
        position={Position.Top}
        id={Position.Top}
        isValidConnection={isValidConnectionChecker}
        className={classes.top}
      />
      <Handle
        onClick={stopPropagation}
        type="source"
        position={Position.Bottom}
        isValidConnection={isValidConnectionChecker}
        id={Position.Bottom}
        className={classes.bottom}
      />
    </>
  );
};
