import { NodeLikeItem } from './types';

export const getNextStepIdFromCondition = <T extends NodeLikeItem>(
  item: T,
  condition?: boolean
) => (condition ? item.stepOnTrue?.id : item.stepOnFalse?.id);
