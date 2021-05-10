import React from 'react';
import { BaseConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import { MenuItem, Stack, Typography } from '@material-ui/core';
import { FormDatePicker, FormSelect } from '@scrapper-gate/frontend/form';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { ConditionalRuleDefinitionsProps } from '../../types';

const supportedWhen = [
  BaseConditionalRuleWhen.MoreThan,
  BaseConditionalRuleWhen.MoreThanOrEqual,
  BaseConditionalRuleWhen.Equal,
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
    <Stack alignItems="center" spacing={spacing} direction="row">
      <Typography>Current date</Typography>
      <FormSelect
        defaultValue={BaseConditionalRuleWhen.Equal}
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
        label="Value"
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
