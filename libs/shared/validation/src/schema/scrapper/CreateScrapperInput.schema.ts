import {
  CreateScrapperInput,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import { enumField } from '../../modifiers/enum';
import joi from 'joi';

export const CreateScrapperInputSchema = joi.object<CreateScrapperInput>({
  name: joi.string().max(255).required(),
  type: enumField(ScrapperType).required(),
});
