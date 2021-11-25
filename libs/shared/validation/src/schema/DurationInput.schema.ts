import { DurationInput, DurationUnit } from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { maxDuration } from '../constants';
import { enumField } from '../modifiers/enum';

export const DurationInputSchema = joi.object<DurationInput>({
  unit: enumField(DurationUnit).required(),
  value: joi.number().required().max(maxDuration),
});
