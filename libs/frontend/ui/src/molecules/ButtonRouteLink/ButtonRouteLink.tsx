import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

const PREFIX = 'ButtonRouteLink';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledLink = styled(Link)(() => ({
  [`& .${classes.button}`]: {
    padding: 0,
    margin: 0,
    minWidth: 'auto',
  },
}));

export const ButtonRouteLink = ({ children, ...props }: LinkProps) => {
  return (
    <StyledLink {...props}>
      <Button variant="text" size="small" className={classes.button}>
        {children}
      </Button>
    </StyledLink>
  );
};
