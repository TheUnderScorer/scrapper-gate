import {
  ConditionalRule,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import { addSeconds, subSeconds } from 'date-fns';
import { v4 } from 'uuid';
import { resolveRules } from '../resolveRules';
import { BaseConditionalRuleWhen, ConditionalRuleTypes } from '../types';
import { makeDateResolver } from './dateResolver';

const now = new Date();

describe('Date resolver', () => {
  it.each<[rule: ConditionalRule, date: Date, expectedResult: boolean]>([
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.Equals,
        value: now.valueOf(),
      },
      now,
      true,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.Equals,
        value: addSeconds(now, 30).valueOf(),
      },
      now,
      false,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.LessThan,
        value: addSeconds(now, 30).valueOf(),
      },
      now,
      true,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.LessThan,
        value: subSeconds(now, 30).valueOf(),
      },
      now,
      false,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.MoreThan,
        value: now.valueOf(),
      },
      subSeconds(now, 30),
      false,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.MoreThan,
        value: now.valueOf(),
      },
      addSeconds(now, 30),
      true,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.Exists,
        value: now.valueOf(),
      },
      null,
      false,
    ],
    [
      {
        id: v4(),
        type: ConditionalRuleTypes.Date,
        when: BaseConditionalRuleWhen.NotEmpty,
        value: now.valueOf(),
      },
      null,
      false,
    ],
  ])(
    'should return true if rule passed',
    async (rule, date, expectedResult) => {
      const { result } = await resolveRules({
        resolvers: {
          [ConditionalRuleTypes.Date]: makeDateResolver(date),
        },
        ruleGroups: [
          {
            id: v4(),
            type: ConditionalRuleGroupType.Any,
            rules: [rule],
          },
        ],
      });

      expect(result).toEqual(expectedResult);
    }
  );
});