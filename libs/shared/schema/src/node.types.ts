import { BaseEntity, NodePosition } from './types';

export interface NodeLikeItem extends Pick<BaseEntity, 'id'> {
  nextStep?: Pick<BaseEntity, 'id'>;
  previousSteps?: Pick<BaseEntity, 'id'>[];
  stepOnTrue?: Pick<BaseEntity, 'id'>;
  stepOnFalse?: Pick<BaseEntity, 'id'>;
  position?: NodePosition;
  type?: string;
}
