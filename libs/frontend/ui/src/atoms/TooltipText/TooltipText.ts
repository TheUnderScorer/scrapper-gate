import { Typography } from '@material-ui/core';
import { styled } from '@material-ui/styles';

export const TooltipText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
}));
