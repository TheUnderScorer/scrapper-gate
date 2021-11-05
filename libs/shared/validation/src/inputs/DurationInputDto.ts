import { DurationInput, DurationUnit } from '@scrapper-gate/shared/schema';
import { BaseSchema } from '../BaseSchema';
import * as jf from 'joiful';
import { requiredEnum } from '../decorators/enum';

export class DurationInputDto
  extends BaseSchema<DurationInput>
  implements DurationInput
{
  @jf.number()
  value: number;

  @requiredEnum(DurationUnit)
  unit: DurationUnit;
}
