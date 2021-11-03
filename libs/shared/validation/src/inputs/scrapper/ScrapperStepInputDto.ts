import {
  DurationInput,
  MouseButton,
  ScrapperAction,
  ScrapperRunSettingsInput,
  ScrapperStep,
  ScrapperStepInput,
  ScrapperWaitType,
  VariableType,
} from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { optionalEnum } from '../../decorators/enum';
import { noSpecialChars } from '../../decorators/noSpecialChars';
import { supportsVariables } from '../../decorators/supportsVariables';
import { unique } from '../../decorators/unique';
import { uuid } from '../../decorators/uuid';
import { JoiMessages } from '../../types';
import { DurationInputDto } from '../DurationInputDto';
import { SelectorDto } from '../SelectorDto';
import { ScrapperConditionalRuleGroupInputDto } from './ScrapperConditionalRuleGroupInputDto';
import { ScrapperRunSettingsInputDto } from './ScrapperRunSettingsInputDto';

export class ScrapperStepInputDto
  extends BaseSchema<ScrapperStepInput>
  implements ScrapperStepInput
{
  @(uuid().allow(null, ''))
  id: string;

  @supportsVariables({
    baseSchema: jf.string(),
    onNotIncludesVariableKey: (joi) => joi.string().uri().allow(null),
    onIncludesVariableKey: (joi) => joi.string().allow(null),
  })
  url: string;

  @(jf.number().allow(null))
  typeDelay?: number;

  @(jf.number().max(4).allow(null))
  clickTimes?: number;

  @(optionalEnum(MouseButton).allow(null))
  mouseButton?: MouseButton;

  @optionalEnum(ScrapperAction)
  action?: ScrapperAction;

  @(jf
    .string()
    .allow(null)
    .custom(noSpecialChars({ max: 50, supportsVariables: true }))
    .custom(
      unique({
        getValueFromContext: (context: { steps: ScrapperStep[] }) =>
          context.steps,
        getValue: (step) => step.key,
        isTarget: (parent, value) => parent.id === value.id,
      })
    ))
  key?: string;

  @(jf.number().allow(null))
  goBackSteps?: number;

  @(jf.string().uri().allow(null))
  navigateToUrl?: string;

  @(jf.number().max(99999).allow(null))
  reloadDelay?: number;

  @(jf.boolean().allow(null))
  useUrlFromPreviousStep?: boolean;

  @(uuid().allow(null))
  nextStepId?: string;

  @(uuid().allow(null))
  stepIdOnTrue?: string;

  @(uuid().allow(null))
  stepIdOnFalse?: string;

  @(jf.array({ elementClass: SelectorDto }).allow(null))
  selectors?: SelectorDto[];

  @(jf
    .array({ elementClass: ScrapperConditionalRuleGroupInputDto })
    .allow(null))
  conditionalRules?: ScrapperConditionalRuleGroupInputDto[];

  @(jf.object({ objectClass: ScrapperRunSettingsInputDto }).allow(null))
  newRunSettings?: ScrapperRunSettingsInput;

  @(jf.boolean().allow(null))
  fullPageScreenshot?: boolean;

  @(jf.boolean().allow(null))
  isFirst?: boolean;

  @(jf.string().custom(({ joi }) =>
    joi.when('action', {
      is: ScrapperAction.ReadAttribute,
      then: joi
        .string()
        .required()
        .messages({
          [JoiMessages.Required]: 'Provide attribute to read.',
        }),
    })
  ))
  attributeToRead?: string;

  @optionalEnum(VariableType)
  valueType?: VariableType;

  @(optionalEnum(ScrapperWaitType).custom(({ joi }) =>
    joi.when('action', {
      is: ScrapperAction.Wait,
      then: joi.string().valid(...Object.values(ScrapperWaitType)),
    })
  ))
  waitType?: ScrapperWaitType;

  @(jf.object({ objectClass: DurationInputDto }).allow(null))
  waitDuration?: DurationInput;
}
