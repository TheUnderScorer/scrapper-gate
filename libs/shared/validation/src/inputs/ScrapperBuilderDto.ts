import { BaseSchema } from '@scrapper-gate/shared/validation';
import { ScrapperStepNodeDto } from './ScrapperStepNodeDto';
import * as jf from 'joiful';

export class ScrapperBuilderDto extends BaseSchema<ScrapperBuilderDto> {
  @jf.array({ elementClass: ScrapperStepNodeDto })
  items: ScrapperStepNodeDto[];
}
