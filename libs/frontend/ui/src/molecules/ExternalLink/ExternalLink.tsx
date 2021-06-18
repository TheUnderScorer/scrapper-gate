import { Link, LinkProps, Stack } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OpenInNew } from '@material-ui/icons';
import React from 'react';

export type ExternalLinkProps = Omit<LinkProps, 'target'>;

const useStyles = makeStyles({
  stack: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
});

export const ExternalLink = ({ children, ...props }: ExternalLinkProps) => {
  const classes = useStyles();

  return (
    <Link {...props} target="_blank">
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        component="span"
        className={classes.stack}
      >
        <OpenInNew fontSize="small" />
        <span>{children}</span>
      </Stack>
    </Link>
  );
};
