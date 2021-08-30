import { Stack, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useMemo } from 'react';

const useStyles = makeStyles((theme) => ({
  keyHint: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
  container: {
    display: 'inline-flex',
  },
}));

const replace = [['command', '⌘']];

export interface KeyHintProps {
  children: string;
}

export const KeyHint = ({ children }: KeyHintProps) => {
  const classes = useStyles();

  const replacedChildren = useMemo(() => {
    return replace
      .reduce<string>((acc, replacePayload) => {
        const [from, to] = replacePayload;

        return acc.replace(from, to);
      }, children)
      .trim()
      .split('+')
      .map((text) => text.trim());
  }, [children]);

  return (
    <Stack spacing={0.5} direction="row" className={classes.container}>
      {replacedChildren.map((child, index) => (
        <Typography variant="body1" key={index} className={classes.keyHint}>
          {child}
        </Typography>
      ))}
    </Stack>
  );
};
