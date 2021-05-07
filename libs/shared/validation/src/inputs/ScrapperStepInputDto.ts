import {
  MouseButton,
  ScrapperAction,
  ScrapperStepInput,
} from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { optionalEnum } from '../decorators/enum';
import { uuid } from '../decorators/uuid';
import { SelectorDto } from './SelectorDto';
import { BaseSchema } from '../BaseSchema';

export class ScrapperStepInputDto
  extends BaseSchema<ScrapperStepInput>
  implements ScrapperStepInput {
  @uuid()
  id: string;

  @(jf.string().uri().allow(null))
  url: string;

  @(jf.number().allow(null))
  typeDelay?: number;

  @(jf.number().max(4).allow(null))
  clickTimes?: number;

  @(optionalEnum(MouseButton).allow(null))
  mouseButton?: MouseButton;

  @optionalEnum(ScrapperAction)
  action?: ScrapperAction;

  @(jf.string().max(50).allow(null))
  key?: string;

  @(jf.number().allow(null))
  goBackSteps?: number;

  @(jf.string().uri().allow(null))
  navigateToUrl?: string;

  @(jf.number().max(99999).allow(null))
  reloadDelay?: number;

  @(jf.boolean().allow(null))
  useUrlFromPreviousStep?: boolean;

  @(uuid().allow(null))
  nextStepId?: string;

  @(uuid().allow(null))
  stepIdOnTrue?: string;

  @(uuid().allow(null))
  stepIdOnFalse?: string;

  @(jf.array({ elementClass: SelectorDto }).allow(null))
  selectors?: SelectorDto[];
}
