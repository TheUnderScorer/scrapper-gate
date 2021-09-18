import { Stack } from '@mui/material';
import {
  VariableSelect,
  VariablesTextField,
} from '@scrapper-gate/frontend/domain/variables';
import { EnumSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { ConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import { Maybe } from '@scrapper-gate/shared/schema';
import React from 'react';
import { ruleLabels } from '../../labels';
import { valueSupportedWhen } from '../../valueSupportedWhen';
import { VariableRuleProps } from './VariableRule.types';

const notSupportedWhen = [
  ConditionalRuleWhen.Exists,
  ConditionalRuleWhen.NotExists,
];

const supportedWhen = Object.values(ConditionalRuleWhen).filter(
  (when) => !notSupportedWhen.includes(when)
);

export const VariableRule = ({
  fieldVariant,
  getName,
  spacing,
}: VariableRuleProps) => {
  const what = useFormFieldValue(getName('what'));
  const when = useFormFieldValue<Maybe<ConditionalRuleWhen>>(getName('when'));

  return (
    <Stack spacing={spacing}>
      <VariableSelect
        variant={fieldVariant}
        name={getName('what')}
        label="Variable"
      />
      {what && (
        <>
          <EnumSelect
            enumObj={supportedWhen}
            variant={fieldVariant}
            name={getName('when')}
            label={ruleLabels.when}
          />
          {when && valueSupportedWhen.includes(when) && (
            <VariablesTextField
              name={getName('value')}
              label={ruleLabels.value}
              variant={fieldVariant}
            />
          )}
        </>
      )}
    </Stack>
  );
};
