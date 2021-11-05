import {
  NodeLikeItem,
  travelNodeLike as travel,
} from '@scrapper-gate/shared/node';
import { Maybe, ScrapperStep, Variable } from '@scrapper-gate/shared/schema';
import { scrapperActionHasTextValue } from './logic/scrapperActionHasTextValue';
import { variableFromScrapperStep } from './variableFromScrapperStep';

type Keys = keyof Pick<NodeLikeItem, 'stepOnFalse' | 'stepOnTrue' | 'nextStep'>;

export type GetPotentialVariablesStep = Pick<
  ScrapperStep,
  'key' | 'action' | 'id'
> &
  {
    [Key in Keys]?: Maybe<Pick<ScrapperStep, 'id'>>;
  };

interface PotentialVariablesForStep {
  step: GetPotentialVariablesStep;
  steps: GetPotentialVariablesStep[];
  travelNodeLike?: typeof travel;
}

export const getPotentialVariablesForStep = ({
  step,
  steps,
  travelNodeLike = travel,
}: PotentialVariablesForStep) => {
  const result: Variable[] = [];

  const filteredSteps = steps.filter((step) =>
    scrapperActionHasTextValue(step.action)
  );

  travelNodeLike({
    start: step,
    items: filteredSteps,
    direction: 'in',
    callback: (currentStep) => {
      if (currentStep.key) {
        result.push(variableFromScrapperStep(currentStep));
      }
    },
  });

  return result;
};
