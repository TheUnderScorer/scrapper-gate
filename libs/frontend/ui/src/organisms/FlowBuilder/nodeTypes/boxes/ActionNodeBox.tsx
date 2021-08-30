import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React from 'react';
import { Centered } from '../../../../atoms/Centered/Centered';
import { NodeIconBoxProps } from '../../FlowBuilder.types';

export type ActionNodeBoxProps = NodeIconBoxProps;

const useStyles = makeStyles((theme) => ({
  paper: {
    '&.MuiPaper-root': {
      backgroundColor: theme.palette.flowBuilderColors.action,
      color: theme.palette.flowBuilderColors.actionText,
    },
  },
  span: {
    display: 'inline-flex',
  },
}));

export const ActionNodeBox = ({
  icon,
  className,
  width,
  height,
  onDoubleClick,
  iconClassName,
  handles,
}: ActionNodeBoxProps) => {
  const classes = useStyles();

  return (
    <Paper
      className={classNames(className, classes.paper, 'action-node-box')}
      onDoubleClick={onDoubleClick}
      variant="outlined"
      style={{
        width,
        height,
        position: 'relative',
      }}
    >
      <Centered>
        <span className={classNames(iconClassName, classes.span)}>{icon}</span>
      </Centered>
      {handles}
    </Paper>
  );
};
