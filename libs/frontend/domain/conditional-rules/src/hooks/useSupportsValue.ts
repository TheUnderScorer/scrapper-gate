import {
  FieldNameCreator,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { ConditionalRuleDefinition } from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleCondition,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { useMemo } from 'react';

export const useSupportsValue = <Type extends ConditionalRuleType>(
  definition: ConditionalRuleDefinition<Type>,
  getName: FieldNameCreator
) => {
  const condition = useFormFieldValue<ConditionalRuleCondition>(
    getName('condition')
  );

  return useMemo(
    () =>
      condition &&
      (!definition.valueSupportedConditions ||
        definition.valueSupportedConditions.includes(condition)),
    [definition.valueSupportedConditions, condition]
  );
};
