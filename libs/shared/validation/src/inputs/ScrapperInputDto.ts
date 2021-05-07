import { ScrapperInput } from '@scrapper-gate/shared/schema';
import { uuid } from '../decorators/uuid';
import * as jf from 'joiful';
import {
  BaseSchema,
  ScrapperStepInputDto,
} from '@scrapper-gate/shared/validation';

export class ScrapperInputDto
  extends BaseSchema<ScrapperInput>
  implements ScrapperInput {
  @(uuid().required())
  id: string;

  @jf.string()
  name?: string;

  @jf.array({ elementClass: ScrapperStepInputDto })
  steps?: ScrapperStepInputDto[];
}
