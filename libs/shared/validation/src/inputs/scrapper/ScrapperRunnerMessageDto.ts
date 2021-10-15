import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import {
  RunnerTrigger,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';
import { BaseSchema } from '../../BaseSchema';
import { requiredEnum } from '../../decorators/enum';
import { uuid } from '../../decorators/uuid';
import * as jf from 'joiful';
import { ScrapperRunSettingsInputDto } from './ScrapperRunSettingsInputDto';

export class ScrapperRunnerMessageDto
  extends BaseSchema<ScrapperRunnerMessageDto>
  implements ScrapperRunnerMessagePayload
{
  @(uuid().required())
  runId: string;

  @requiredEnum(RunnerTrigger)
  trigger: RunnerTrigger;

  @jf.object({ objectClass: ScrapperRunSettingsInputDto })
  runSettings?: ScrapperRunSettings;
}
