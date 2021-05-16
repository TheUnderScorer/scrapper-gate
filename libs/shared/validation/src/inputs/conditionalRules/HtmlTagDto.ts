import { HtmlElementRuleMeta } from '@scrapper-gate/shared/domain/conditional-rules';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { SelectorDto } from '../SelectorDto';

export class HtmlTagDto
  extends BaseSchema<HtmlTagDto>
  implements Pick<HtmlElementRuleMeta, 'selectors'> {
  @jf.array({ elementClass: SelectorDto })
  selectors: SelectorDto[];
}
