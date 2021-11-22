import { Stack } from '@mui/material';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import { EnumSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import {
  ConditionalRuleType,
  HtmlConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import React, { ReactNode } from 'react';
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

  const valueName =
    type === HtmlConditionalRuleType.Tag ? 'tagName' : 'attribute.value';

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
            name={getName('attribute.name')}
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
