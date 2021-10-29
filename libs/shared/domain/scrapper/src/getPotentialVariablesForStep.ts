import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  NodeLikeItem,
  travelNodeLike as travel,
} from '@scrapper-gate/shared/node';
import {
  ScrapperStep,
  Variable,
  VariableScope,
} from '@scrapper-gate/shared/schema';
import { scrapperActionHasValue } from './scrapperActionHasValue';

type Keys = keyof Pick<NodeLikeItem, 'stepOnFalse' | 'stepOnTrue' | 'nextStep'>;

export type GetPotentialVariablesStep = Pick<
  ScrapperStep,
  'key' | 'action' | 'id'
> &
  {
    [Key in Keys]?: Pick<ScrapperStep, 'id'>;
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
    scrapperActionHasValue(step.action)
  );

  travelNodeLike({
    start: step,
    items: filteredSteps,
    direction: 'in',
    callback: (currentStep) => {
      if (currentStep.key) {
        result.push(
          createVariable({
            key: currentStep.key,
            scope: VariableScope.Scrapper,
          })
        );
      }
    },
  });

  return result;
};
