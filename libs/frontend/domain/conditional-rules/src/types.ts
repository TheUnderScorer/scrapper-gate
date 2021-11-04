import { TextFieldProps } from '@mui/material';
import { Selection } from '@scrapper-gate/frontend/common';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import {
  ConditionalRuleTypes,
  ConditionalRuleWhen,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRule, Variable } from '@scrapper-gate/shared/schema';
import { ComponentType, ReactNode } from 'react';

export type ConditionalRulesSelection = Selection<ConditionalRuleDefinition>;

interface RuleTitleContext {
  variables: Variable[];
}

export interface ConditionalRuleDefinition {
  Component: ComponentType<ConditionalRuleDefinitionsProps>;
  defaultWhen?: ConditionalRuleWhen;
  type: ConditionalRuleTypes;
  createTitle?: (
    rule: ConditionalRule,
    ctx: RuleTitleContext
  ) => RuleTitleDefinition[];
}

export interface ConditionalRuleDefinitionsProps {
  definition: Omit<ConditionalRuleDefinition, 'Component'>;
  getName: FieldNameCreator;
  spacing?: number;
  fieldVariant?: TextFieldProps['variant'];
}

export enum RuleTitleDefinitionType {
  Highlight = 'Highlight',
  Value = 'Value',
  Text = 'Text',
}

export interface RuleTitleDefinition {
  type: RuleTitleDefinitionType;
  text?: ReactNode;
}
