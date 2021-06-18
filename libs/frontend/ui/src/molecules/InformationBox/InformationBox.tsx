import { Stack, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';

export interface InformationBoxProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  action?: ReactNode;
  spacing?: number;
  className?: string;
}

export const InformationBox = ({
  action,
  subTitle,
  spacing = 1,
  title,
  className,
}: InformationBoxProps) => {
  return (
    <Stack spacing={spacing} className={className} alignItems="center">
      {title && <Typography variant="h6">{title}</Typography>}
      {subTitle && <Typography variant="subtitle2">{subTitle}</Typography>}
      {action}
    </Stack>
  );
};
