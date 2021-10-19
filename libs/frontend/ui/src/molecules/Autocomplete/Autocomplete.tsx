import React from 'react';
import { AutocompleteProps } from './Autocomplete.types';
import { Autocomplete as BaseAutocomplete, TextField } from '@mui/material';

export const Autocomplete = <T extends unknown>({
  getOptionLabel,
  options,
  renderInput,
  value,
  onChange,
  inputValue,
  onInputChange,
  freeSolo,
  ...InputProps
}: AutocompleteProps<T>) => {
  return (
    <BaseAutocomplete
      selectOnFocus
      value={value as T}
      inputValue={inputValue}
      onInputChange={onInputChange}
      freeSolo={freeSolo}
      onChange={onChange}
      renderInput={
        renderInput ?? ((props) => <TextField {...props} {...InputProps} />)
      }
      options={options}
      getOptionLabel={getOptionLabel}
    />
  );
};
