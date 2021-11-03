import { ConditionalRunScrapperStepResult, ReadTextValue } from './types';

export const isReadTextScrapperStepResult = (
  value: unknown
): value is ReadTextValue =>
  Boolean(value && typeof value === 'object' && 'value' in value);

export const isConditionalScrapperStepResult = (
  value: unknown
): value is ConditionalRunScrapperStepResult =>
  Boolean(value && typeof value === 'object' && 'result' in value);
