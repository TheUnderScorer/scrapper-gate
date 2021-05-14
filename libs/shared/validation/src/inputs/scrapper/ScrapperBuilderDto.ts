import { ScrapperStepNodeDto } from './ScrapperStepNodeDto';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';

export class ScrapperBuilderDto extends BaseSchema<ScrapperBuilderDto> {
  @jf.array({ elementClass: ScrapperStepNodeDto })
  items: ScrapperStepNodeDto[];
}
