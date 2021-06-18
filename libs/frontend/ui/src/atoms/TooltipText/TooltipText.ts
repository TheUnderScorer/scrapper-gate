import { Typography } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { CSSProperties } from 'react';

export const TooltipText = styled(Typography)(({ theme }) => ({
  ...(theme.typography.body2 as CSSProperties),
}));
