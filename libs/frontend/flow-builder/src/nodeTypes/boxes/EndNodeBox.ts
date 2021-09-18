import { styled } from '@mui/material/styles';
import { RoundNodeBox } from '../RoundNodeBox';

export const EndNodeBox = styled(RoundNodeBox)(({ theme }) => ({
  '&.action-node-box': {
    backgroundColor: theme.palette.flowBuilderColors.end,
    color: theme.palette.flowBuilderColors.endText,
  },
}));
