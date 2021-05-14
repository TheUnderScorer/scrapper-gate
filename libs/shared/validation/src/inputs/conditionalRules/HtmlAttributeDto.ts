import { HtmlElementRuleMeta } from '@scrapper-gate/shared/domain/conditional-rules';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { isHtmlAttribute } from '../../common/isHtmlAttribute';
import { SelectorDto } from '../SelectorDto';

export class HtmlAttributeDto
  extends BaseSchema<HtmlAttributeDto>
  implements Pick<HtmlElementRuleMeta, 'attribute' | 'selectors'> {
  @jf.array({ elementClass: SelectorDto })
  selectors: SelectorDto[];

  @(jf
    .string()
    .allow(null)
    .custom(({ joi }) => {
      return joi.custom((value, helpers) => {
        if (value && !isHtmlAttribute(value)) {
          return helpers.message({
            custom: 'Invalid attribute',
          });
        }

        return value;
      });
    }))
  attribute?: string;
}
