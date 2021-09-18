import { styled } from '@mui/material/styles';
import { RoundNodeBox } from '../RoundNodeBox';

export const StartNodeBox = styled(RoundNodeBox)(({ theme }) => ({
  '&.action-node-box': {
    backgroundColor: theme.palette.flowBuilderColors.start,
    color: theme.palette.flowBuilderColors.startText,
  },
}));
