import { Stack, Typography } from '@mui/material';
import {
  useVariablesContextSelector,
  VariablesDateField,
  VariableSelect,
  VariablesTextField,
} from '@scrapper-gate/frontend/domain/variables';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { VariableType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { useSupportsValue } from '../../hooks/useSupportsValue';
import { ConditionSelect } from '../ConditionSelect/ConditionSelect';
import { VariableRuleProps } from './VariableRule.types';

export const VariableRule = ({
  fieldVariant,
  getName,
  spacing,
  definition,
}: VariableRuleProps) => {
  const variableKey = useFormFieldValue<string>(getName('variableKey'));
  const variable = useVariablesContextSelector((ctx) =>
    ctx.filteredVariables.find((v) => v.key === variableKey)
  );

  const supportsValue = useSupportsValue(definition, getName);

  return (
    <Stack spacing={spacing} direction="row" alignItems="center">
      <Typography variant="body2">Variable</Typography>
      <VariableSelect
        sx={{
          minWidth: 150,
        }}
        size="small"
        variant={fieldVariant}
        name={getName('variableKey')}
      />
      {variableKey && (
        <>
          <ConditionSelect
            sx={{
              minWidth: 150,
            }}
            definition={definition}
            fieldVariant={fieldVariant}
            getName={getName}
          />
          {supportsValue &&
            (variable?.type === VariableType.Date ? (
              <VariablesDateField
                size="small"
                sx={{ minWidth: 150 }}
                name={getName('expectedValue')}
                variant={fieldVariant}
              />
            ) : (
              <VariablesTextField
                sx={{
                  minWidth: 150,
                }}
                size="small"
                name={getName('expectedValue')}
                placeholder="Expected value..."
                variant={fieldVariant}
              />
            ))}
        </>
      )}
    </Stack>
  );
};
