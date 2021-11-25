import { Stack, Typography } from '@mui/material';
import { createTextSerializeStrategy } from '@scrapper-gate/frontend/block-editor';
import { VariablesDateField } from '@scrapper-gate/frontend/domain/variables';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { DateFormat } from '@scrapper-gate/shared/common';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { ConditionalRuleProps } from '../../types';
import { ConditionSelect } from '../ConditionSelect/ConditionSelect';

const now = new Date();

const dateFormat = DateFormat.Date;
const serializeStrategy = createTextSerializeStrategy(dateFormat);

export const DateRule = ({
  getName,
  spacing,
  fieldVariant,
  definition,
}: ConditionalRuleProps<ConditionalRuleType.Date>) => {
  const value = useFormFieldValue<Date | undefined>(getName('expectedDate'));

  return (
    <Stack spacing={spacing} direction="row" alignItems="center">
      <Typography variant="body2">Date</Typography>
      <ConditionSelect
        sx={{
          minWidth: 150,
        }}
        fieldVariant={fieldVariant}
        getName={getName}
        definition={definition}
      />
      <VariablesDateField
        serializeStrategy={serializeStrategy}
        size="small"
        sx={{
          minWidth: '150px',
        }}
        variant={fieldVariant}
        name={getName('expectedDate')}
        inputFormat={dateFormat}
        fieldProps={{
          initialValue: value ?? now,
        }}
      />
    </Stack>
  );
};
