import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  ScrapperStep,
  Variable,
  VariableScope,
} from '@scrapper-gate/shared/schema';

export type ScrapperStepForVariable = Pick<
  ScrapperStep,
  'action' | 'valueType' | 'key'
> &
  Pick<Variable, 'value' | 'defaultValue'>;

export const variableFromScrapperStep = (step: ScrapperStepForVariable) =>
  createVariable({
    key: step.key,
    type: step.valueType,
    scope: VariableScope.Scrapper,
  });
