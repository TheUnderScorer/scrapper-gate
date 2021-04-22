import React from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { NodeIconBoxProps } from '../../FlowBuilder.types';
import { Centered } from '@scrapper-gate/frontend/ui';

export type ActionNodeBoxProps = NodeIconBoxProps;

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.flowBuilderColors.action,
    color: theme.palette.flowBuilderColors.actionText,
  },
}));

export const ActionNodeBox = ({
  icon,
  className,
  width,
  height,
  onClick,
  iconClassName,
  handles,
}: ActionNodeBoxProps) => {
  const classes = useStyles();

  return (
    <Paper
      className={classNames(className, classes.paper, 'action-node-box')}
      onClick={onClick}
      variant="outlined"
      style={{
        width,
        height,
        position: 'relative',
      }}
    >
      <Centered>
        <span className={iconClassName}>{icon}</span>
      </Centered>
      {handles}
    </Paper>
  );
};
