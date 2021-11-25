import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import {
  MouseButton,
  ScrapperAction,
  ScrapperStep,
  ScrapperStepInput,
  ScrapperWaitType,
  Variable,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { JoiMessages } from '../../types';
import joi from 'joi';
import { maxDuration } from '../../constants';
import { enumField } from '../../modifiers/enum';
import { keyField } from '../../modifiers/key';
import { supportsVariables } from '../../modifiers/supportsVariables';
import { uuid } from '../../modifiers/uuid';
import { DurationInputSchema } from '../DurationInput.schema';
import { PositionInputSchema } from '../PositionInput.schema';
import { SelectorSchema } from '../Selector.schema';
import { ScrapperConditionalRuleGroupInputSchema } from './ScrapperConditionalRuleGroupInput.schema';
import { ScrapperRunSettingsInputSchema } from './ScrapperRunSettingsInput.schema';

const durationForWaitType = (requiredOnWaitType: ScrapperWaitType) =>
  DurationInputSchema.allow(null).when('action', {
    is: ScrapperAction.Wait,
    then: DurationInputSchema.when('waitType', {
      is: requiredOnWaitType,
      then: DurationInputSchema.required(),
    }),
  });

export const ScrapperStepInputSchema = joi.object<ScrapperStepInput>({
  id: uuid().allow(null),
  url: joi.string().when('useUrlFromPreviousStep', {
    is: true,
    then: joi.string(),
    otherwise: supportsVariables({
      schema: joi.string().required(),
      onIncludesVariableKey: () => joi.string().required(),
      onNotIncludesVariableKey: () => joi.string().uri().required(),
    }),
  }),
  useUrlFromPreviousStep: joi.boolean().allow(null),
  typeDelay: joi.number().allow(null).max(maxDuration),
  clickTimes: joi.number().allow(null).max(10),
  mouseButton: enumField(MouseButton).allow(null),
  action: enumField(ScrapperAction).required(),
  key: keyField({
    getValuesFromContext: (context: {
      steps: ScrapperStep[];
      variables: Variable[];
    }) => context.steps,
    getUniqueValue: (step) => step.key,
    isTargetValue: (parent, value) => parent.id === value.id,
    getAdditionalKeys: (context) =>
      context.variables?.map((v) => v.key).filter(ExcludeFalsy),
  }),
  goBackSteps: joi.number().max(100).allow(null),
  navigateToUrl: joi.string().uri().allow(null),
  reloadDelay: joi.number().max(maxDuration).allow(null),
  nextStepId: uuid().allow(null),
  stepIdOnTrue: uuid().allow(null),
  stepIdOnFalse: uuid().allow(null),
  selectors: joi.array().items(SelectorSchema).allow(null),
  conditionalRules: joi.array().items(ScrapperConditionalRuleGroupInputSchema),
  newRunSettings: ScrapperRunSettingsInputSchema.allow(null),
  fullPageScreenshot: joi.boolean().allow(null),
  attributeToRead: joi
    .string()
    .allow(null)
    .when('action', {
      is: ScrapperAction.ReadAttribute,
      then: joi
        .string()
        .required()
        .messages({
          [JoiMessages.Required]: 'Provide attribute to read',
        }),
    }),
  valueType: enumField(VariableType).allow(null),
  isFirst: joi.boolean().allow(null),
  jsCode: joi.string().allow(null).when('action', {
    is: ScrapperAction.RunJavascript,
    then: joi.string().required(),
  }),
  position: PositionInputSchema,
  waitType: joi
    .string()
    .allow(null)
    .when('action', {
      is: ScrapperAction.Wait,
      then: enumField(ScrapperWaitType).required(),
    }),
  waitDuration: durationForWaitType(ScrapperWaitType.Time),
  waitIntervalCheck: durationForWaitType(ScrapperWaitType.Condition),
  waitIntervalTimeout: durationForWaitType(ScrapperWaitType.Condition),
});
