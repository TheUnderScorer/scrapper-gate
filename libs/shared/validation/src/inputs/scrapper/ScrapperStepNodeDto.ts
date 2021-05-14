import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { ScrapperStepInputDto } from './ScrapperStepInputDto';

export class ScrapperStepNodeDto extends BaseSchema<ScrapperStepNodeDto> {
  @jf.object({ objectClass: ScrapperStepInputDto })
  data: ScrapperStepInputDto;
}
