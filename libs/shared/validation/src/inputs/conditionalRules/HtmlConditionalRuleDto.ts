import {
  ConditionalRuleGroupMatchType,
  HtmlConditionalRule,
  HtmlConditionalRuleAttribute,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { optionalEnum } from '../../decorators/enum';
import { ConditionalRuleDto } from './ConditionalRuleDto';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { SelectorDto } from '../SelectorDto';

class AttributeConditionDto
  extends BaseSchema<AttributeConditionDto>
  implements HtmlConditionalRuleAttribute
{
  @(jf.string().allow(null))
  value?: string;

  @(jf.string().required())
  attribute: string;
}

export class HtmlConditionalRuleDto
  extends ConditionalRuleDto
  implements HtmlConditionalRule
{
  @(jf.string().custom(({ joi }) =>
    joi.string()?.when('type', {
      is: HtmlConditionalRuleType.Tag,
      then: joi.string()?.required(),
    })
  ))
  tagName?: string;

  @jf.array({ elementClass: SelectorDto })
  selectors: SelectorDto[];

  @optionalEnum(ConditionalRuleGroupMatchType)
  matchType?: ConditionalRuleGroupMatchType;

  @optionalEnum(HtmlConditionalRuleType)
  type?: HtmlConditionalRuleType;

  @(jf.object().custom(({ joi }) =>
    joi.when('type', {
      is: HtmlConditionalRuleType.Attribute,
      then: AttributeConditionDto.toJoi().required(),
    })
  ))
  attribute?: AttributeConditionDto;
}
