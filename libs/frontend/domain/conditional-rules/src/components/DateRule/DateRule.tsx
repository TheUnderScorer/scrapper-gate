import { MenuItem, Stack, Typography } from '@material-ui/core';
import { VariablesDateField } from '@scrapper-gate/frontend/domain/variables';
import { FormSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { BaseConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import React, { useMemo } from 'react';
import { ruleLabels } from '../../labels';
import { ConditionalRuleDefinitionsProps } from '../../types';

const supportedWhen = [
  BaseConditionalRuleWhen.MoreThan,
  BaseConditionalRuleWhen.MoreThanOrEqual,
  BaseConditionalRuleWhen.Equals,
  BaseConditionalRuleWhen.LessThan,
  BaseConditionalRuleWhen.LessThanOrEqual,
];

const now = new Date();

export const DateRule = ({
  getName,
  spacing,
  fieldVariant,
}: ConditionalRuleDefinitionsProps) => {
  const value = useFormFieldValue(getName('value'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo(() => (value ? undefined : now), []);

  return (
    <Stack alignItems="baseline" spacing={spacing} direction="row">
      <Typography>Current date</Typography>
      <FormSelect
        label={ruleLabels.when}
        className="date-rule-select"
        defaultValue={BaseConditionalRuleWhen.Equals}
        variant={fieldVariant}
        name={getName('when')}
      >
        {supportedWhen.map((when) => (
          <MenuItem key={when} value={when}>
            {toDisplayText(when)}
          </MenuItem>
        ))}
      </FormSelect>
      <VariablesDateField
        variant={fieldVariant}
        name={getName('value')}
        label={ruleLabels.value}
        inputFormat={DateFormat.Date}
        fieldProps={{
          initialValue,
        }}
      />
    </Stack>
  );
};
