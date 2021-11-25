import { ScrapperInput } from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { uuid } from '../../modifiers/uuid';
import { PositionInputSchema } from '../PositionInput.schema';
import { VariableInputSchema } from '../variables/VariableInput.schema';
import { ScrapperRunSettingsInputSchema } from './ScrapperRunSettingsInput.schema';
import { ScrapperStepInputSchema } from './ScrapperStepInput.schema';

export const ScrapperInputSchema = joi.object<ScrapperInput>({
  id: uuid().required(),
  name: joi.string().required(),
  steps: joi.array().items(ScrapperStepInputSchema),
  variables: joi.array().items(VariableInputSchema).allow(null),
  runSettings: ScrapperRunSettingsInputSchema.allow(null),
  startNodePosition: PositionInputSchema.allow(null),
});
