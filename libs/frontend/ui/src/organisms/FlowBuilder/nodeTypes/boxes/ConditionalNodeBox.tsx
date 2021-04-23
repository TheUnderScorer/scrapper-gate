import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import React from 'react';
import classNames from 'classnames';
import { NodeIconBoxProps } from '../../FlowBuilder.types';
import { Centered } from '@scrapper-gate/frontend/ui';

export type ConditionalNodeBoxProps = NodeIconBoxProps;

const offset = 10;

const useStyles = makeStyles((theme) => ({
  text: {
    zIndex: 2,
  },

  content: {
    transform: 'rotate(-45deg)',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  diamond: (props: ConditionalNodeBoxProps) => ({
    position: 'relative',
    height: props.height ? props.height - offset : undefined,
    width: props.width ? props.width - offset : undefined,
    transform: 'rotate(45deg)',
    backgroundColor: theme.palette.flowBuilderColors.condition,
    color: theme.palette.flowBuilderColors.conditionText,
    marginBottom: props.handles ? theme.spacing(2) : undefined,
  }),
}));

export const ConditionalNodeBox = (props: ConditionalNodeBoxProps) => {
  const { className, handles, icon, iconClassName, onClick } = props;

  const classes = useStyles(props);

  return (
    <Paper
      onClick={onClick}
      variant="outlined"
      className={classNames(classes.diamond, className, 'conditional-node')}
    >
      <Centered className={classes.content}>
        <span className={iconClassName}>{icon}</span>
        {handles}
      </Centered>
    </Paper>
  );
};