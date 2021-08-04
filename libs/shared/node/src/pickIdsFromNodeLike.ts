import { pickId } from '@scrapper-gate/shared/common';
import { NodeLikeItem } from './types';

export const pickIdsFromNodeLike = <T extends NodeLikeItem>(
  item: T
): NodeLikeItem => {
  return {
    ...item,
    nextStep: pickId(item.nextStep),
    stepOnFalse: pickId(item.stepOnFalse),
    stepOnTrue: pickId(item.stepOnTrue),
    previousSteps: item.previousSteps?.map((step) => pickId(step)),
  };
};
