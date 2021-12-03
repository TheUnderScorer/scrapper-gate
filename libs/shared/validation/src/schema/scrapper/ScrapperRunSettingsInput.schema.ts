import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
  ScrapperRunSettingsInput,
} from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { maxDuration } from '../../constants';
import { enumField } from '../../modifiers/enum';

export const ScrapperRunSettingsInputSchema =
  joi.object<ScrapperRunSettingsInput>({
    initialUrl: joi.string().uri().allow(null),
    dialogBehaviour: enumField(ScrapperDialogBehaviour),
    noElementsFoundBehavior: enumField(ScrapperNoElementsFoundBehavior),
    timeoutMs: joi.number().allow(null).max(maxDuration),
    promptText: joi.string().allow(null).max(400),
  });
