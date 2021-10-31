import { BaseEntity, Maybe, NodePosition } from '@scrapper-gate/shared/schema';

export interface NodeLikeItem<
  Step extends Pick<BaseEntity, 'id'> = Pick<BaseEntity, 'id'>
> extends Pick<BaseEntity, 'id'> {
  nextStep?: Maybe<Step>;
  previousSteps?: Maybe<Step[]>;
  stepOnTrue?: Maybe<Step>;
  stepOnFalse?: Maybe<Step>;
  position?: Maybe<NodePosition>;
  type?: Maybe<string>;
  isFirst?: Maybe<boolean>;
}

export interface NodeLikeItemInput extends Pick<BaseEntity, 'id'> {
  stepIdOnTrue?: Maybe<string>;
  stepIdOnFalse?: Maybe<string>;
  nextStepId?: Maybe<string>;
}
