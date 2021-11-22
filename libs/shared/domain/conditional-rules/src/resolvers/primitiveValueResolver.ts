/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConditionalRuleCondition } from '@scrapper-gate/shared/schema';

const getValue = <V>(value: V) => {
  if (value instanceof Date) {
    return value.valueOf();
  }

  if (typeof value === 'object') {
    return 'valueOf' in value && typeof (value as any).valueOf === 'function'
      ? (value as any).valueOf()
      : (value as any).toString();
  }

  return value;
};

interface PrimitiveValueResolverParams<V = any, E = any> {
  expectedValue?: E;
  value?: V;
  condition: ConditionalRuleCondition;
}

export const primitiveValueResolver = <V = any, E = any>({
  condition,
  ...params
}: PrimitiveValueResolverParams<V, E>) => {
  const value = getValue(params.value);
  const expectedValue = getValue(params.expectedValue);

  const includes = () => value?.toString()?.includes(expectedValue?.toString());

  switch (condition) {
    case ConditionalRuleCondition.NotEqual:
      return value?.toString() !== expectedValue?.toString();

    case ConditionalRuleCondition.Equals:
      return value?.toString() === expectedValue?.toString();

    case ConditionalRuleCondition.Includes:
      return includes();

    case ConditionalRuleCondition.NotIncludes:
      return !includes();

    case ConditionalRuleCondition.LessThan:
      return Number(expectedValue) > Number(value);

    case ConditionalRuleCondition.LessThanOrEqual:
      return Number(expectedValue) >= Number(value);

    case ConditionalRuleCondition.MoreThan:
      return Number(expectedValue) < Number(value);

    case ConditionalRuleCondition.MoreThanOrEqual:
      return Number(expectedValue) <= Number(value);

    case ConditionalRuleCondition.Empty:
    case ConditionalRuleCondition.NotExists:
      return !value;

    case ConditionalRuleCondition.NotEmpty:
    case ConditionalRuleCondition.Exists:
      return Boolean(value);

    default:
      return false;
  }
};
