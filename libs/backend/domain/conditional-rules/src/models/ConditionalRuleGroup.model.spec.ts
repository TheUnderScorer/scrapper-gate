import {
  ConditionalRuleTypes,
  HtmlElementRuleMeta,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleGroupType } from '@scrapper-gate/shared/schema';
import { ConditionalRuleGroupModel } from './ConditionalRuleGroup.model';

describe('ConditionalRuleGroupModel', () => {
  it('should return selectors', () => {
    const rule = ConditionalRuleGroupModel.create({
      id: '1',
      type: ConditionalRuleGroupType.All,
      rules: [
        {
          id: '1',
          type: ConditionalRuleTypes.HtmlElement,
          meta: {
            type: ConditionalRuleGroupType.All,
            selectors: [
              {
                value: 'h1',
              },
              {
                value: 'a',
              },
            ],
          } as HtmlElementRuleMeta,
        },
      ],
    });

    expect(rule.selectors).toMatchInlineSnapshot(`
      Array [
        Object {
          "value": "h1",
        },
        Object {
          "value": "a",
        },
      ]
    `);
  });
});
