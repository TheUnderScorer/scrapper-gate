import { EnumSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { first } from '@scrapper-gate/shared/common';
import { ConditionalRulesMap } from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleCondition,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import React, { useEffect, useMemo } from 'react';
import { useField } from 'react-final-form';
import { useConditionalRulesContext } from '../../providers/ConditionalRulesContext.provider';
import { ConditionSelectProps } from './ConditionSelect.types';

export const ConditionSelect = <Type extends ConditionalRuleType>({
  definition,
  fieldVariant,
  getName,
  sx,
}: ConditionSelectProps<Type>) => {
  const { context } = useConditionalRulesContext();

  const rule = useFormFieldValue<ConditionalRulesMap[Type]>(getName());
  const {
    input: { value: condition, onChange },
  } = useField(getName('condition'));

  const supportedConditions = useMemo(() => {
    if (typeof definition.supportedConditions === 'function') {
      if (!rule) {
        return {};
      }

      return definition.supportedConditions(rule, context) ?? {};
    }

    return definition.supportedConditions ?? ConditionalRuleCondition;
  }, [context, definition, rule]);

  const defaultValue = useMemo(() => {
    return first(Object.keys(supportedConditions));
  }, [supportedConditions]);

  useEffect(() => {
    if (!Object.values(supportedConditions).includes(condition)) {
      onChange(defaultValue);
    }
  }, [condition, defaultValue, onChange, supportedConditions]);

  return (
    <EnumSelect
      size="small"
      className="condition-select"
      defaultValue={defaultValue}
      enumObj={supportedConditions}
      variant={fieldVariant}
      name={getName('condition')}
      sx={sx}
    />
  );
};
