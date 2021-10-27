/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-restricted-imports
import type { TextFieldProps as MuiTextFieldPropsType } from '@mui/material/TextField/TextField';
import {
  FormDatePicker,
  FormDatePickerProps,
} from '@scrapper-gate/frontend/form';
import { getDisplayValue } from '@scrapper-gate/shared/common';
import { Variable, VariableType } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useField } from 'react-final-form';
import {
  useVariablesContextSelector,
  VariablesProvider,
} from '../../providers/VariablesProvider';
import { VariablesTextField } from '../VariablesTextField/VariablesTextField';

export type VariablesDateFieldProps = Omit<
  FormDatePickerProps<Date>,
  'formatTextFieldValue'
>;

const defaultArray: any[] = [];

export const VariablesDateField = (props: VariablesDateFieldProps) => {
  const variablesName = useVariablesContextSelector((ctx) => ctx.name);

  const filterVariables = useCallback(
    (variables: Variable[]) =>
      variables.filter((variable) => variable.type === VariableType.Date) ??
      defaultArray,
    []
  );

  const field = useField<string | null>(props.name, {
    format: (value) =>
      getDisplayValue({
        value,
        dateFormat: props.inputFormat,
        isDate: true,
      }),
  });
  const fieldValue = field.input.value;

  const formatValue = useCallback(
    (value: unknown) => {
      if (!value) {
        return '';
      }

      if (value instanceof Date) {
        return value;
      }

      try {
        return new Date(value as any);
      } catch {
        return fieldValue as string;
      }
    },
    [fieldValue]
  );

  const renderInput = useCallback(
    ({ value, onChange, ...fieldProps }: MuiTextFieldPropsType) => (
      <VariablesTextField
        name={props.name}
        {...fieldProps}
        className={classNames(fieldProps.className, props.className)}
        dateFormat={props.inputFormat}
      />
    ),
    [props]
  );

  return (
    <VariablesProvider name={variablesName} filter={filterVariables}>
      <FormDatePicker
        {...props}
        formatValue={formatValue}
        renderInput={renderInput}
      />
    </VariablesProvider>
  );
};
