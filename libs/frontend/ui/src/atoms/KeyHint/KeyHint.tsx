import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';

const PREFIX = 'KeyHint';

const classes = {
  keyHint: `${PREFIX}-keyHint`,
  container: `${PREFIX}-container`,
};

const StyledStack = styled(Stack)(({ theme }) => ({
  [`& .${classes.keyHint}`]: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },

  [`&.${classes.container}`]: {
    display: 'inline-flex',
  },
}));

const replace = [['command', '⌘']];

export interface KeyHintProps {
  children: string;
}

export const KeyHint = ({ children }: KeyHintProps) => {
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
    <StyledStack spacing={0.5} direction="row" className={classes.container}>
      {replacedChildren.map((child, index) => (
        <Typography variant="body1" key={index} className={classes.keyHint}>
          {child}
        </Typography>
      ))}
    </StyledStack>
  );
};
