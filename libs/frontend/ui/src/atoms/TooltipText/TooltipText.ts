import { styled, Typography } from '@material-ui/core';

export const TooltipText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
}));
