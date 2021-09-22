import { Stack, Typography } from '@mui/material';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import React, { ReactNode } from 'react';

export interface InformationBoxProps extends ThemedSxProps {
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
  sx,
}: InformationBoxProps) => {
  return (
    <Stack spacing={spacing} className={className} alignItems="center" sx={sx}>
      {title && <Typography variant="h6">{title}</Typography>}
      {subTitle && <Typography variant="subtitle2">{subTitle}</Typography>}
      {action}
    </Stack>
  );
};
