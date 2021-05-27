import { styled } from '@material-ui/styles';
import { RoundNodeBox } from '../RoundNodeBox';

export const EndNodeBox = styled(RoundNodeBox)(({ theme }) => ({
  '&.action-node-box': {
    backgroundColor: theme.palette.flowBuilderColors.end,
    color: theme.palette.flowBuilderColors.endText,
  },
}));
