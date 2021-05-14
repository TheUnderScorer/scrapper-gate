import { TextFieldProps } from '@material-ui/core';
import { Selection } from '@scrapper-gate/frontend/common';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { ComponentType, ReactNode } from 'react';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';

export type ConditionalRulesSelection = Selection<ConditionalRuleDefinition>;

export interface ConditionalRuleDefinition {
  Component: ComponentType<ConditionalRuleDefinitionsProps>;
  type: string;
  createTitle?: (rule: ConditionalRule) => ReactNode;
}

export interface ConditionalRuleDefinitionsProps {
  definition: Omit<ConditionalRuleDefinition, 'Component'>;
  getName: FieldNameCreator;
  spacing?: number;
  fieldVariant?: TextFieldProps['variant'];
}
