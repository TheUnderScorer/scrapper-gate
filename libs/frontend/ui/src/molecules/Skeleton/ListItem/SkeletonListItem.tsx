import React from 'react';
import { Stack } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

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
