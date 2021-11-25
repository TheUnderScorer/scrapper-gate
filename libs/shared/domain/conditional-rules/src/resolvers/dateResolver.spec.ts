import { DateFormat } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleCondition,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
  DateConditionalRule,
} from '@scrapper-gate/shared/schema';
import { addSeconds } from 'date-fns';
import { resolveRules } from '../resolveRules';
import { makeDateResolver } from './dateResolver';

const now = new Date();

describe('Date resolver', () => {
  it.each<
    [rule: DateConditionalRule, date: Date | null, expectedResult: boolean]
  >([
    [
      {
        ruleType: ConditionalRuleType.Date,
        condition: ConditionalRuleCondition.Equals,
        expectedDate: now,
      },
      now,
      true,
    ],
    [
      {
        ruleType: ConditionalRuleType.Date,
        condition: ConditionalRuleCondition.Equals,
        expectedDate: addSeconds(now, 30),
      },
      now,
      false,
    ],
    [
      {
        ruleType: ConditionalRuleType.Date,
        condition: ConditionalRuleCondition.MoreThan,
        expectedDate: addSeconds(now, 30),
      },
      now,
      false,
    ],
    [
      {
        ruleType: ConditionalRuleType.Date,
        condition: ConditionalRuleCondition.LessThan,
        expectedDate: addSeconds(now, 30),
      },
      now,
      true,
    ],
  ])(
    'should return true if rule has passed',
    async (rule, date, expectedResult) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleType.Date]: makeDateResolver(
            date,
            DateFormat.DateTime
          ),
        },
        ruleGroups: [
          {
            matchType: ConditionalRuleGroupMatchType.Any,
            rules: [rule],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );
});
