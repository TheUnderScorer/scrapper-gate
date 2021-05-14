import {
  ConditionalRuleGroupInput,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import { array } from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { requiredEnum } from '../../decorators/enum';
import { uuid } from '../../decorators/uuid';
import { ScrapperConditionalRuleInputDto } from './ScrapperConditionalRuleInputDto';

export class ScrapperConditionalRuleGroupInputDto
  extends BaseSchema<ConditionalRuleGroupInput>
  implements ConditionalRuleGroupInput {
  @(uuid().required())
  id: string;

  @array({ elementClass: ScrapperConditionalRuleInputDto })
  rules: ScrapperConditionalRuleInputDto[];

  @requiredEnum(ConditionalRuleGroupType)
  type: ConditionalRuleGroupType;
}
