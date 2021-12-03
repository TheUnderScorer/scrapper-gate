import { EnumSelectProps } from '@scrapper-gate/frontend/form';
import { ConditionalRuleDefinition } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import { ConditionalRuleProps } from '../../types';

export interface ConditionSelectProps<
  Type extends ConditionalRuleType,
  Ctx = unknown
> extends Pick<EnumSelectProps, 'sx'>,
    Pick<
      ConditionalRuleProps<Type>,
      'fieldVariant' | 'definition' | 'getName'
    > {
  definition: ConditionalRuleDefinition<Type, Ctx>;
}
