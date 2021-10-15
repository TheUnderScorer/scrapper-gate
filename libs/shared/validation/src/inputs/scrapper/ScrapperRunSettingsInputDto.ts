import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
  ScrapperRunSettingsInput,
} from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { optionalEnum } from '../../decorators/enum';

export class ScrapperRunSettingsInputDto
  extends BaseSchema<ScrapperRunSettingsInput>
  implements ScrapperRunSettingsInput
{
  @(jf.string().uri().allow(null))
  initialUrl?: string;

  @optionalEnum(ScrapperDialogBehaviour)
  dialogBehaviour?: ScrapperDialogBehaviour;

  @optionalEnum(ScrapperNoElementsFoundBehavior)
  noElementsFoundBehavior?: ScrapperNoElementsFoundBehavior;

  @(jf.number().optional().allow(null).max(900_000))
  timeoutMs?: number;

  @(jf.string().optional().allow(null).max(100))
  promptText?: string;
}
