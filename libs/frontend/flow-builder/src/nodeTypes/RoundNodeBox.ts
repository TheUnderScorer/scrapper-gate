import { styled } from '@mui/material/styles';
import { ActionNodeBox } from './boxes/ActionNodeBox';

export const RoundNodeBox = styled(ActionNodeBox)({
  '&.action-node-box': {
    borderRadius: '50%',
  },
});
