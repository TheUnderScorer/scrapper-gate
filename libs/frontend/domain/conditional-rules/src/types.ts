import { Selection } from '@scrapper-gate/frontend/common';
import { ComponentType, ReactNode } from 'react';
import { ConditionalRule, Selector } from '@scrapper-gate/shared/schema';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { TextFieldProps } from '@material-ui/core';

export type ConditionalRulesSelection = Selection<ConditionalRuleDefinition>;

export interface ConditionalRuleDefinition {
  Component: ComponentType<ConditionalRuleDefinitionsProps>;
  type: string;
  createTitle?: (rule: ConditionalRule) => ReactNode;
}

export interface HtmlElementRuleMeta {
  selectors: Selector[];
  attribute?: string;
  tag?: string;
}

export interface ConditionalRuleDefinitionsProps {
  definition: Omit<ConditionalRuleDefinition, 'Component'>;
  getName: FieldNameCreator;
  spacing?: number;
  fieldVariant?: TextFieldProps['variant'];
}

export enum HtmlElementWhat {
  Attribute = 'Attribute',
  Tag = 'Tag',
}
