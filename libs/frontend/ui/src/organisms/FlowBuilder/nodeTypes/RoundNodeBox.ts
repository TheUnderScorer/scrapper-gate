import { ActionNodeBox } from './boxes/ActionNodeBox';
import { styled } from '@material-ui/core';

export const RoundNodeBox = styled(ActionNodeBox)({
  '&.action-node-box': {
    borderRadius: '50%',
  },
});
