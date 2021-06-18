import {
  MouseButton,
  ScrapperAction,
  ScrapperStepInput,
} from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { optionalEnum } from '../../decorators/enum';
import { noSpecialChars } from '../../decorators/noSpecialChars';
import { supportsVariables } from '../../decorators/supportsVariables';
import { uuid } from '../../decorators/uuid';
import { SelectorDto } from '../SelectorDto';
import { ScrapperConditionalRuleGroupInputDto } from './ScrapperConditionalRuleGroupInputDto';

export class ScrapperStepInputDto
  extends BaseSchema<ScrapperStepInput>
  implements ScrapperStepInput {
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

  @(noSpecialChars({ max: 50, supportsVariables: true }).allow(null))
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
}
