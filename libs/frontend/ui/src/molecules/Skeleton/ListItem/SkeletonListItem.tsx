import { Skeleton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const PREFIX = 'SkeletonListItem';

const classes = {
  text: `${PREFIX}-text`,
};

const StyledStack = styled(Stack)({
  [`& .${classes.text}`]: {
    flex: 1,
  },
});

export const SkeletonListItem = () => {
  return (
    <StyledStack spacing={1} direction="row">
      <Skeleton width={30} height={30} variant="circular" />
      <Skeleton variant="text" className={classes.text} />
    </StyledStack>
  );
};
