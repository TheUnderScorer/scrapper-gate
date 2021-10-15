import { ScrapperInput, VariableInput } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { uuid } from '../../decorators/uuid';
import { ScrapperRunSettingsInputDto } from './ScrapperRunSettingsInputDto';
import { ScrapperStepInputDto } from './ScrapperStepInputDto';
import { ScrapperVariableDto } from './ScrapperVariableDto';

export class ScrapperInputDto
  extends BaseSchema<ScrapperInput>
  implements ScrapperInput
{
  @(uuid().required())
  id: string;

  @jf.string()
  name?: string;

  @jf.array({ elementClass: ScrapperStepInputDto })
  steps?: ScrapperStepInputDto[];

  @jf.array({ elementClass: ScrapperVariableDto })
  variables?: VariableInput[];

  @jf.object({ objectClass: ScrapperRunSettingsInputDto })
  runSettings?: ScrapperRunSettingsInputDto;
}
