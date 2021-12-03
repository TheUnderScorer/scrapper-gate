import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  Maybe,
} from '@scrapper-gate/shared/schema';
import { primitiveValueResolver } from './primitiveValueResolver';

interface ArrayValueResolverParams<V, E> {
  condition: ConditionalRuleCondition;
  expectedValue?: E;
  values?: V[];
  matchType?: Maybe<ConditionalRuleGroupMatchType>;
  customHandlers?: {
    [Key in ConditionalRuleCondition]?: (
      value: V,
      expectedValue?: E
    ) => boolean;
  };
}

export const arrayValueResolver = <V, E>({
  condition,
  expectedValue,
  values = [],
  customHandlers,
  matchType = ConditionalRuleGroupMatchType.All,
}: ArrayValueResolverParams<V, E>): boolean => {
  const matchFn =
    matchType === ConditionalRuleGroupMatchType.All
      ? values.every.bind(values)
      : values.some.bind(values);

  const customHandler = customHandlers?.[condition];

  if (customHandler) {
    return matchFn((value) => customHandler(value, expectedValue));
  }

  switch (condition) {
    case ConditionalRuleCondition.Empty:
    case ConditionalRuleCondition.NotExists:
      return !values.length || matchFn?.((value) => !value);

    case ConditionalRuleCondition.NotEmpty:
    case ConditionalRuleCondition.Exists:
      return values.length > 0 && matchFn?.(Boolean);

    default:
      return (
        values.length > 0 &&
        matchFn?.((value) =>
          primitiveValueResolver({
            condition,
            value,
            expectedValue,
          })
        )
      );
  }
};
