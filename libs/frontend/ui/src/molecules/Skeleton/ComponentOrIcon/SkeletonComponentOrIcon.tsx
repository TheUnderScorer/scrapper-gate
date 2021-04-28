/* eslint-disable react/jsx-no-useless-fragment */
import React, { PropsWithChildren } from 'react';
import { Skeleton, SkeletonProps } from '@material-ui/lab';

export interface SkeletonComponentOrIconProps
  extends Pick<SkeletonProps, 'width' | 'height' | 'variant'> {
  loading?: boolean;
}

export const SkeletonComponentOrIcon = ({
  children,
  loading,
  variant = 'circle',
  ...props
}: PropsWithChildren<SkeletonComponentOrIconProps>) => {
  return !loading ? <>{children}</> : <Skeleton variant={variant} {...props} />;
};
