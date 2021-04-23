import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TileRadioProps } from './TileRadio.types';
import classNames from 'classnames';
import { SelectablePaper } from '../SelectablePaper/SelectablePaper';
import { Stack, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  text: {
    userSelect: 'none',
  },
  paper: {
    textAlign: 'center',
  },
}));

export const TileRadio = ({
  icon,
  title,
  children,
  ...paperProps
}: TileRadioProps) => {
  const classes = useStyles();

  return (
    <SelectablePaper
      {...paperProps}
      className={classNames(classes.paper, paperProps.className)}
    >
      <Stack
        alignItems="center"
        spacing={1}
        direction="column"
        className={classes.text}
      >
        {icon}
        <Typography variant="body2">{title}</Typography>
      </Stack>
      {children}
    </SelectablePaper>
  );
};
