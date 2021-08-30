import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  button: {
    padding: 0,
    margin: 0,
    minWidth: 'auto',
  },
}));

export const ButtonRouteLink = ({ children, ...props }: LinkProps) => {
  const classes = useStyles();

  return (
    <Link {...props}>
      <Button variant="text" size="small" className={classes.button}>
        {children}
      </Button>
    </Link>
  );
};
