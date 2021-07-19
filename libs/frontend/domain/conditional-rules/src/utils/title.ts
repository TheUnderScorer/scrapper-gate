import { toDisplayText } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleDefinition,
  RuleTitleDefinition,
  RuleTitleDefinitionType,
} from '../types';

export interface BaseCreateTitleParams {
  valueFormatter?: (value: string) => string;
}

export const baseCreateTitle =
  ({
    valueFormatter,
  }: BaseCreateTitleParams = {}): ConditionalRuleDefinition['createTitle'] =>
  (rule) => {
    if (!rule.type) {
      return [];
    }

    if (!rule?.when || !rule?.value) {
      return [
        {
          type: RuleTitleDefinitionType.Text,
          text: toDisplayText(rule.type),
        },
      ];
    }

    const base: RuleTitleDefinition[] = [
      {
        type: RuleTitleDefinitionType.Text,
        text: toDisplayText(rule.type),
      },
      {
        type: RuleTitleDefinitionType.Highlight,
        text: toDisplayText(rule.when).toLowerCase(),
      },
    ];

    try {
      return [
        ...base,
        {
          type: RuleTitleDefinitionType.Value,
          text: valueFormatter
            ? valueFormatter(rule.value as string)
            : rule.value,
        },
      ];
    } catch {
      return [
        ...base,
        {
          type: RuleTitleDefinitionType.Value,
          text: rule.value,
        },
      ];
    }
  };
