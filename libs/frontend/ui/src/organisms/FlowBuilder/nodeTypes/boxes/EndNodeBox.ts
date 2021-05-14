import { RoundNodeBox } from '../RoundNodeBox';
import { styled } from '@material-ui/core';

export const EndNodeBox = styled(RoundNodeBox)(({ theme }) => ({
  '&.action-node-box': {
    backgroundColor: theme.palette.flowBuilderColors.end,
    color: theme.palette.flowBuilderColors.endText,
  },
}));
