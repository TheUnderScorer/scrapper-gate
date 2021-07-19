import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { RunnerTrigger } from '@scrapper-gate/shared/schema';
import { BaseSchema } from '../../BaseSchema';
import { requiredEnum } from '../../decorators/enum';
import { uuid } from '../../decorators/uuid';

export class ScrapperRunnerMessageDto
  extends BaseSchema<ScrapperRunnerMessageDto>
  implements ScrapperRunnerMessagePayload
{
  @(uuid().required())
  scrapperId: string;

  @requiredEnum(RunnerTrigger)
  trigger: RunnerTrigger;
}
