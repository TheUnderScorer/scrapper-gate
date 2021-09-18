import { MenuItem, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { VariablesDateField } from '@scrapper-gate/frontend/domain/variables';
import { FormSelect, useFormFieldValue } from '@scrapper-gate/frontend/form';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { ConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { ruleLabels } from '../../labels';
import { ConditionalRuleDefinitionsProps } from '../../types';

const PREFIX = 'DateRule';

const classes = {
  select: `${PREFIX}-select`,
  date: `${PREFIX}-date`,
};

const StyledStack = styled(Stack)(() => ({
  [`& .${classes.select}`]: {
    minWidth: 100,
  },

  [`& .${classes.date}`]: {
    flex: 1,
  },
}));

const supportedWhen = [
  ConditionalRuleWhen.MoreThan,
  ConditionalRuleWhen.MoreThanOrEqual,
  ConditionalRuleWhen.Equals,
  ConditionalRuleWhen.NotEqual,
  ConditionalRuleWhen.LessThan,
  ConditionalRuleWhen.LessThanOrEqual,
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
    <StyledStack spacing={spacing}>
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
    </StyledStack>
  );
};
