import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { optionalEnum } from '../../decorators/enum';

export class ScrapperRunSettingsDto
  extends BaseSchema<ScrapperRunSettings>
  implements ScrapperRunSettings
{
  @(jf.string().uri().allow(null))
  initialUrl?: string;

  @optionalEnum(ScrapperDialogBehaviour)
  dialogBehaviour?: ScrapperDialogBehaviour;

  @optionalEnum(ScrapperNoElementsFoundBehavior)
  noElementsFoundBehavior?: ScrapperNoElementsFoundBehavior;

  @(jf.number().optional().allow(null).max(900_000))
  timeoutMs?: number;
}
