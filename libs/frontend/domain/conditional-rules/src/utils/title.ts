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

    if (!rule?.when) {
      return [
        {
          type: RuleTitleDefinitionType.Text,
          text: toDisplayText(rule.type),
        },
      ];
    }

    const titleDefinitions: RuleTitleDefinition[] = [
      {
        type: RuleTitleDefinitionType.Text,
        text: toDisplayText(rule.type),
      },
    ];

    if (rule.what) {
      titleDefinitions.push({
        type: RuleTitleDefinitionType.Value,
        text: rule.what,
      });
    }

    titleDefinitions.push({
      type: RuleTitleDefinitionType.Highlight,
      text: toDisplayText(rule.when).toLowerCase(),
    });

    if (!rule.value) {
      return titleDefinitions;
    }

    try {
      return [
        ...titleDefinitions,
        {
          type: RuleTitleDefinitionType.Value,
          text: valueFormatter
            ? valueFormatter(rule.value as string)
            : rule.value,
        },
      ];
    } catch {
      return [
        ...titleDefinitions,
        {
          type: RuleTitleDefinitionType.Value,
          text: rule.value,
        },
      ];
    }
  };
