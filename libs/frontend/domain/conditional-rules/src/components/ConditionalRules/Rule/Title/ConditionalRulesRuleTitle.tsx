import { Stack } from '@material-ui/core';
import { PrimaryLightButton } from '@scrapper-gate/frontend/ui';
import { BaseConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import React, { memo } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import {
  RuleTitleDefinition,
  RuleTitleDefinitionType,
} from '../../../../types';
import { valueSupportedWhen } from '../../../../valueSupportedWhen';

export interface ConditionalRulesRuleTitleProps {
  definitions: RuleTitleDefinition[];
  rule: ConditionalRule;
}

const getComponent = (
  definition: RuleTitleDefinition,
  rule: ConditionalRule
) => {
  if (!definition.text) {
    return null;
  }

  switch (definition.type) {
    case RuleTitleDefinitionType.Value:
      if (!valueSupportedWhen.includes(rule.when as BaseConditionalRuleWhen)) {
        return null;
      }

      return <span>{`"${definition.text}"`}</span>;

    case RuleTitleDefinitionType.Highlight:
      return (
        <PrimaryLightButton size="small">{definition.text}</PrimaryLightButton>
      );

    default:
      return <span>{definition.text}</span>;
  }
};

const BaseConditionalRulesRuleTitle = ({
  definitions,
  rule,
}: ConditionalRulesRuleTitleProps) => {
  return (
    <TruncateMarkup lines={1} ellipsis={<span>...</span>}>
      <Stack alignItems="center" spacing={1} direction="row">
        {definitions.map((definition, index) => {
          const cmp = getComponent(definition, rule);

          if (!cmp) {
            return null;
          }

          return <TruncateMarkup.Atom key={index}>{cmp}</TruncateMarkup.Atom>;
        })}
      </Stack>
    </TruncateMarkup>
  );
};

export const ConditionalRulesRuleTitle = memo(BaseConditionalRulesRuleTitle);
