import { ConditionalRunScrapperStepResult, ScrapperValue } from './types';

export const isReadTextScrapperStepResult = (
  value: unknown
): value is ScrapperValue =>
  Boolean(value && typeof value === 'object' && 'value' in value);

export const isConditionalScrapperStepResult = (
  value: unknown
): value is ConditionalRunScrapperStepResult =>
  Boolean(value && typeof value === 'object' && 'result' in value);
