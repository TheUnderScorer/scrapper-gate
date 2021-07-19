import { Stack } from '@material-ui/core';
import { PrimaryLightChip } from '@scrapper-gate/frontend/ui';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import React, { memo } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import {
  RuleTitleDefinition,
  RuleTitleDefinitionType,
} from '../../../../types';

export interface ConditionalRulesRuleTitleProps {
  definitions: RuleTitleDefinition[];
  rule: ConditionalRule;
}

const getComponent = (definition: RuleTitleDefinition) => {
  if (!definition.text) {
    return null;
  }

  switch (definition.type) {
    case RuleTitleDefinitionType.Value:
      return <span>{`"${definition.text}"`}</span>;

    case RuleTitleDefinitionType.Highlight:
      return (
        <PrimaryLightChip
          size="small"
          label={definition.text}
          color="primary"
        />
      );

    default:
      return <span>{definition.text}</span>;
  }
};

const BaseConditionalRulesRuleTitle = ({
  definitions,
}: ConditionalRulesRuleTitleProps) => {
  return (
    <TruncateMarkup lines={1} ellipsis={<span>...</span>}>
      <Stack alignItems="center" spacing={1} direction="row">
        {definitions.map((definition, index) => {
          const cmp = getComponent(definition);

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
