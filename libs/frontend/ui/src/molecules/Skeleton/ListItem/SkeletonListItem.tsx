import { Skeleton, Stack } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles({
  text: {
    flex: 1,
  },
});

export const SkeletonListItem = () => {
  const classes = useStyles();

  return (
    <Stack spacing={1} direction="row">
      <Skeleton width={30} height={30} variant="circular" />
      <Skeleton variant="text" className={classes.text} />
    </Stack>
  );
};
