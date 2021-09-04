/* eslint-disable react/jsx-no-useless-fragment */
import { Skeleton, SkeletonProps } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

export interface SkeletonComponentOrIconProps
  extends Pick<SkeletonProps, 'width' | 'height' | 'variant'> {
  loading?: boolean;
}

export const SkeletonComponentOrIcon = ({
  children,
  loading,
  variant = 'circular',
  ...props
}: PropsWithChildren<SkeletonComponentOrIconProps>) => {
  return !loading ? <>{children}</> : <Skeleton variant={variant} {...props} />;
};
