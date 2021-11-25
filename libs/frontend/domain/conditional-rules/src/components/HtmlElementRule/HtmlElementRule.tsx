import { Stack } from '@mui/material';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import { EnumSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import {
  ConditionalRuleType,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import React, { ReactNode, useEffect } from 'react';
import { useForm } from 'react-final-form';
import { useSupportsValue } from '../../hooks/useSupportsValue';
import { ConditionalRuleProps } from '../../types';
import { ConditionSelect } from '../ConditionSelect/ConditionSelect';

export interface HtmlElementRuleProps
  extends ConditionalRuleProps<ConditionalRuleType.HtmlElement>,
    Omit<HtmlElementPickerProps, 'name'> {
  picker?: ReactNode;
}

export const HtmlElementRule = ({
  definition,
  getName,
  spacing,
  fieldVariant,
}: HtmlElementRuleProps) => {
  const supportsValue = useSupportsValue(definition, getName);
  const type = useFormFieldValue<HtmlConditionalRuleType>(getName('type'));

  const { change, getFieldState } = useForm();

  const valueName =
    type === HtmlConditionalRuleType.Tag ? 'tagName' : 'attribute.value';

  // Provides some initial value to "attribute.attribute" field, otherwise validation is never triggered
  useEffect(() => {
    if (type === HtmlConditionalRuleType.Attribute) {
      const attributeField = getFieldState(getName('attribute'));

      if (!attributeField) {
        change(getName('attribute.attribute'), '');
      }
    }
  }, [change, getFieldState, getName, type]);

  return (
    <Stack direction="column" spacing={spacing}>
      <Stack direction="row" spacing={spacing} alignItems="center">
        <EnumSelect
          enumObj={HtmlConditionalRuleType}
          name={getName('type')}
          defaultValue={HtmlConditionalRuleType.Element}
          variant={fieldVariant}
          size="small"
        />
        {type === HtmlConditionalRuleType.Attribute && (
          <VariablesTextField
            placeholder="Attribute to check, ex. class"
            sx={{ minWidth: 225 }}
            name={getName('attribute.attribute')}
            variant={fieldVariant}
            size="small"
          />
        )}
        <ConditionSelect
          definition={definition}
          getName={getName}
          fieldVariant={fieldVariant}
        />
        {supportsValue && (
          <VariablesTextField
            sx={{ minWidth: 150 }}
            name={getName(valueName)}
            placeholder="Expected value..."
            variant={fieldVariant}
            size="small"
          />
        )}
      </Stack>
    </Stack>
  );
};
