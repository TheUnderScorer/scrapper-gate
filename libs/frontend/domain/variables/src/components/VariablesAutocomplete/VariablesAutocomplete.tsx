import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  createFilterOptions,
  FilterOptionsState,
} from '@mui/material';
import { FieldProps, useFieldHasError } from '@scrapper-gate/frontend/form';
import { Highlight } from '@scrapper-gate/frontend/ui';
import { Variable } from '@scrapper-gate/shared/schema';
import React, { useCallback } from 'react';
import { FieldInputProps, FieldMetaState, useField } from 'react-final-form';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';

export interface VariablesAutocompleteChildrenBag {
  autoCompleteParams: AutocompleteRenderInputParams;
  meta: FieldMetaState<string>;
  input: FieldInputProps<string>;
  hasError?: boolean;
}

export interface VariablesAutocompleteProps
  extends Omit<
    AutocompleteProps<Variable, boolean, boolean, boolean>,
    'options' | 'renderInput'
  > {
  children: (params: VariablesAutocompleteChildrenBag) => JSX.Element;
  fieldProps: FieldProps<string>;
  name: string;
}

export const VariablesAutocomplete = ({
  name,
  children,
  fieldProps,
  ...rest
}: VariablesAutocompleteProps) => {
  const { meta, input } = useField(name, fieldProps);

  const hasError = useFieldHasError({
    meta: meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  const variables = useVariablesContextSelector((ctx) => ctx.variables);

  const filterOptions = useCallback(
    (options: Variable[], state: FilterOptionsState<Variable>) => {
      if (!state.inputValue.startsWith('{{')) {
        return [];
      }

      return createFilterOptions<Variable>({
        matchFrom: 'any',
        stringify: (option) => option.key ?? option.id,
      })(options, state);
    },
    []
  );

  return (
    <Autocomplete<Variable, boolean, boolean, boolean>
      {...rest}
      {...input}
      onChange={(event, newValue) => input.onChange(newValue)}
      id={input.name}
      freeSolo
      disableClearable
      renderInput={(params) =>
        children({
          autoCompleteParams: params,
          meta,
          input,
          hasError,
        })
      }
      getOptionLabel={(option) => {
        return option?.key ?? '';
      }}
      filterOptions={filterOptions}
      options={variables}
      renderOption={(props, variable, state) => {
        return (
          <Highlight text={variable.key ?? ''} value={state.inputValue ?? ''} />
        );
      }}
    />
  );
};
