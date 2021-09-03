import { styled } from '@material-ui/styles';
import { ActionNodeBox } from './boxes/ActionNodeBox';

export const RoundNodeBox = styled(ActionNodeBox)({
  '&.action-node-box': {
    borderRadius: '50%',
  },
});
