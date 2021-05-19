import { BaseEntity, NodePosition } from './types';

export interface NodeLikeItem<
  Step extends Pick<BaseEntity, 'id'> = Pick<BaseEntity, 'id'>
> extends Pick<BaseEntity, 'id'> {
  nextStep?: Step;
  previousSteps?: Step[];
  stepOnTrue?: Step;
  stepOnFalse?: Step;
  position?: NodePosition;
  type?: string;
}

export interface NodeLikeItemInput extends Pick<BaseEntity, 'id'> {
  stepIdOnTrue?: string;
  stepIdOnFalse?: string;
  nextStepId?: string;
}
