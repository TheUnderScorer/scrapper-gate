import {
  BrowserType,
  ScrapperType,
  StartScrapperInput,
} from '@scrapper-gate/shared/schema';
import { enumValue } from '../../decorators/enum';
import { uuid } from '../../decorators/uuid';

export class StartScrapperInputDto implements StartScrapperInput {
  @(enumValue(BrowserType)
    .optional()
    .custom(({ joi }) =>
      joi.when('$type', {
        is: ScrapperType.RealBrowser,
        then: joi.string().required(),
      })
    ))
  browserType?: BrowserType;

  @uuid()
  scrapperId: string;
}
