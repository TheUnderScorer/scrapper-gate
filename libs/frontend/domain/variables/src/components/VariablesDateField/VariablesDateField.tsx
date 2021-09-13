/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFieldProps as MuiTextFieldPropsType } from '@material-ui/core/TextField/TextField';

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

  const field = useField<string | null>(props.name);
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
        value={value as any}
        onChange={(text) => {
          const formattedText = getDisplayValue({
            value: text,
            dateFormat: props.inputFormat,
            isDate: true,
          });

          // Ensure that we won't overwrite Date value from date picker with value from TextFieldBlock
          // The reason for that is after user picks value from date picker text field block will automatically trigger change with string as value
          // Not working atm because we still receive string in the end from somewhere :/
          // TODO Investigate if we will actually need Date objects from this field
          if (formattedText !== text) {
            field.input.onChange(text?.trim());
          }
        }}
        dateFormat={props.inputFormat}
      />
    ),
    [field.input, props]
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
