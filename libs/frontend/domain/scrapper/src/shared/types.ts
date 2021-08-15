import { ScrapperStep } from '@scrapper-gate/shared/schema';

export interface ScrapperBuilderStep
  extends Omit<
    ScrapperStep,
    | 'nextStep'
    | 'createdBy'
    | 'updatedAt'
    | 'createdAt'
    | 'previousSteps'
    | 'stepOnFalse'
    | 'stepOnTrue'
  > {
  nextStep?: Pick<ScrapperStep, 'id'>;
  previousSteps?: Pick<ScrapperStep, 'id'>[];
  stepOnTrue?: Pick<ScrapperStep, 'id'>;
  stepOnFalse?: Pick<ScrapperStep, 'id'>;
}
