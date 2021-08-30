import { MenuItem, Stack } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { VariablesDateField } from '@scrapper-gate/frontend/domain/variables';
import { FormSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { ConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { ruleLabels } from '../../labels';
import { ConditionalRuleDefinitionsProps } from '../../types';

const supportedWhen = [
  ConditionalRuleWhen.MoreThan,
  ConditionalRuleWhen.MoreThanOrEqual,
  ConditionalRuleWhen.Equals,
  ConditionalRuleWhen.NotEqual,
  ConditionalRuleWhen.LessThan,
  ConditionalRuleWhen.LessThanOrEqual,
];

const now = new Date();

const useStyles = makeStyles(() => ({
  select: {
    minWidth: 100,
  },
  date: {
    flex: 1,
  },
}));

export const DateRule = ({
  getName,
  spacing,
  fieldVariant,
}: ConditionalRuleDefinitionsProps) => {
  const value = useFormFieldValue(getName('value'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo(() => (value ? undefined : now), []);

  const classes = useStyles();

  return (
    <Stack spacing={spacing}>
      <FormSelect
        label={ruleLabels.when}
        className={classNames('date-rule-select', classes.select)}
        defaultValue={ConditionalRuleWhen.Equals}
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
        fullWidth
        className={classes.date}
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
