/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chip, Select as BaseSelect } from '@mui/material';
import React from 'react';
import { SelectProps } from './Select.types';

export const Select = <T extends unknown>({
  chip,
  variant,
  ...rest
}: SelectProps<T>) => {
  const sx =
    variant === 'plain'
      ? {
          cursor: 'pointer',

          '& .MuiSelect-select': {
            padding: 0,
          },
          '& fieldset': {
            border: 'none',
          },
          '& .MuiSelect-icon': {
            display: 'none',
          },
        }
      : {};

  return (
    <BaseSelect
      {...rest}
      variant={variant === 'plain' ? 'outlined' : variant}
      sx={{
        ...rest.sx,
        ...(sx as any),
      }}
      renderValue={
        chip
          ? (value) => (
              <Chip
                color="primaryLight"
                clickable
                label={
                  rest.renderValue ? rest.renderValue(value) : (value as any)
                }
              />
            )
          : rest.renderValue
      }
    />
  );
};
