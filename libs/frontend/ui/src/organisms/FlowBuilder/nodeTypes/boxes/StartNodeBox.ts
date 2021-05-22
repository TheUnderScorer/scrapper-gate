import { styled } from '@material-ui/styles';
import { RoundNodeBox } from '../RoundNodeBox';

export const StartNodeBox = styled(RoundNodeBox)(({ theme }) => ({
  '&.action-node-box': {
    backgroundColor: theme.palette.flowBuilderColors.start,
    color: theme.palette.flowBuilderColors.startText,
  },
}));
