import { styled } from '@mui/material/styles';
import { stopPropagation } from '@scrapper-gate/frontend/common';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { BaseNodeProperties, HandleBag } from '../../FlowBuilder.types';

const StyledLeftHandle = styled(Handle)({
  left: '-16px',
});

const StyledTopHandle = styled(Handle)({
  top: '-16px',
  marginLeft: '-5px',
});

const StyledBottomHandle = styled(Handle)({
  bottom: '-16px',
  marginLeft: '-5px',
});

export type ConditionalNodeHandlesProps = HandleBag<BaseNodeProperties>;

export const ConditionalNodeHandles = ({
  isValidConnectionChecker,
}: ConditionalNodeHandlesProps) => {
  return (
    <>
      <StyledLeftHandle
        onClick={stopPropagation}
        type="target"
        position={Position.Left}
        id={Position.Left}
        isValidConnection={isValidConnectionChecker}
      />
      <StyledTopHandle
        onClick={stopPropagation}
        type="source"
        position={Position.Top}
        id={Position.Top}
        isValidConnection={isValidConnectionChecker}
      />
      <StyledBottomHandle
        onClick={stopPropagation}
        type="source"
        position={Position.Bottom}
        isValidConnection={isValidConnectionChecker}
        id={Position.Bottom}
      />
    </>
  );
};
