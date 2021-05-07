import {
  BaseSchema,
  ScrapperStepInputDto,
} from '@scrapper-gate/shared/validation';
import * as jf from 'joiful';

export class ScrapperStepNodeDto extends BaseSchema<ScrapperStepNodeDto> {
  @jf.object({ objectClass: ScrapperStepInputDto })
  data: ScrapperStepInputDto;
}
