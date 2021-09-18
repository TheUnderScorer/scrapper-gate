import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSProperties } from 'react';

export const TooltipText = styled(Typography)(({ theme }) => ({
  ...(theme.typography.body2 as CSSProperties),
}));
