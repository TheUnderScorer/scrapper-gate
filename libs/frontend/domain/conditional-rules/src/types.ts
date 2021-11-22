import { TextFieldProps } from '@mui/material';
import { Selection } from '@scrapper-gate/frontend/common';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { ConditionalRuleDefinition } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';

export interface FrontendConditionalRuleDefinition<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Type extends ConditionalRuleType = any
> extends Omit<Selection, 'value' | 'description'> {
  Component: ComponentType<ConditionalRuleProps<Type>>;
  FooterComponent?: ComponentType<ConditionalRuleProps<Type>>;
  definition: ConditionalRuleDefinition<Type>;
}

export interface ConditionalRuleProps<Type extends ConditionalRuleType> {
  definition: ConditionalRuleDefinition<Type>;
  getName: FieldNameCreator;
  spacing?: number;
  fieldVariant?: TextFieldProps['variant'];
}
