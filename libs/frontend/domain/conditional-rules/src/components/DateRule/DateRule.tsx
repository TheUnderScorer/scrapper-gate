import React from 'react';
import { BaseConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import { MenuItem, Stack, Typography } from '@material-ui/core';
import { FormDatePicker, FormSelect } from '@scrapper-gate/frontend/form';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { ConditionalRuleDefinitionsProps } from '../../types';
import { ruleLabels } from '../../labels';

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
      <FormDatePicker
        inputVariant={fieldVariant}
        disableToolbar
        name={getName('value')}
        label={ruleLabels.value}
        format={DateFormat.Date}
        margin="normal"
        variant="inline"
        fieldProps={{
          initialValue: now,
        }}
      />
    </Stack>
  );
};
