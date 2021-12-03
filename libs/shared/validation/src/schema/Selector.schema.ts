import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { enumField } from '../modifiers/enum';

export const SelectorSchema = joi.object<Selector>({
  type: enumField(SelectorType),
  value: joi.string().required(),
});
