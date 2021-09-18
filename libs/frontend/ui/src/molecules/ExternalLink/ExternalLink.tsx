import { OpenInNew } from '@mui/icons-material';
import { Link, LinkProps, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const PREFIX = 'ExternalLink';

const classes = {
  stack: `${PREFIX}-stack`,
};

const StyledLink = styled(Link)({
  [`& .${classes.stack}`]: {
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
});

export type ExternalLinkProps = Omit<LinkProps, 'target'>;

export const ExternalLink = ({ children, ...props }: ExternalLinkProps) => {
  return (
    <StyledLink {...props} target="_blank">
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
    </StyledLink>
  );
};
