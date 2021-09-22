import { Paper } from '@mui/material';
import { Centered } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React from 'react';
import { NodeIconBoxProps } from '../../FlowBuilder.types';

export type ConditionalNodeBoxProps = NodeIconBoxProps;

const offset = 10;

export const ConditionalNodeBox = (props: ConditionalNodeBoxProps) => {
  const { className, handles, icon, iconClassName, onDoubleClick } = props;

  return (
    <Paper
      onDoubleClick={onDoubleClick}
      variant="outlined"
      sx={{
        position: 'relative',
        height: props.height ? props.height - offset : undefined,
        width: props.width ? props.width - offset : undefined,
        transform: 'rotate(45deg)',
        backgroundColor: (theme) => theme.palette.flowBuilderColors.condition,
        color: (theme) => theme.palette.flowBuilderColors.conditionText,
        marginBottom: (theme) => (props.handles ? theme.spacing(2) : undefined),
      }}
      className={classNames(className, 'conditional-node')}
    >
      <Centered
        sx={{
          transform: 'rotate(-45deg)',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className={iconClassName}>{icon}</span>
        {handles}
      </Centered>
    </Paper>
  );
};
