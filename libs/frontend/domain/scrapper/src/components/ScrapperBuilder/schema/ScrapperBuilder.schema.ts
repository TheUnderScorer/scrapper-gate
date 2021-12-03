import { ScrapperBuilderFormState } from '../ScrapperBuilder.types';
import {
  ScrapperRunSettingsInputSchema,
  VariableInputSchema,
} from '@scrapper-gate/shared/validation';
import joi from 'joi';
import { ScrapperStepNodeSchema } from './ScrapperStepNode.schema';

export const ScrapperBuilderSchema = joi.object<ScrapperBuilderFormState>({
  items: joi.array().items(ScrapperStepNodeSchema),
  name: joi.string().required(),
  variables: joi.array().items(VariableInputSchema).allow(null),
  runSettings: ScrapperRunSettingsInputSchema,
});
