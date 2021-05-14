import {
  ConditionalRuleTypes,
  HtmlElementRuleMeta,
  HtmlElementWhat,
} from '@scrapper-gate/shared/domain/conditional-rules';
import * as jf from 'joiful';
import { ConditionalRuleInputDto } from '../conditionalRules/ConditionalRuleInputDto';
import { HtmlAttributeDto } from '../conditionalRules/HtmlAttributeDto';
import { HtmlTagDto } from '../conditionalRules/HtmlTagDto';

export class ScrapperConditionalRuleInputDto extends ConditionalRuleInputDto {
  @(jf.object().custom(({ joi }) => {
    return joi.object().when('type', {
      switch: [
        {
          is: ConditionalRuleTypes.HtmlElement,
          then: joi.object().when('what', {
            switch: [
              {
                is: HtmlElementWhat.Attribute,
                then: HtmlAttributeDto.toJoi(),
              },
              {
                is: HtmlElementWhat.Tag,
                then: HtmlTagDto.toJoi(),
              },
            ],
          }),
        },
      ],
    });
  }))
  meta?: HtmlElementRuleMeta;
}
