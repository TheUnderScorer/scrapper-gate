import { InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import {
  Duration,
  saveParseFloat,
  toDisplayText,
} from '@scrapper-gate/shared/common';
import { DurationUnit } from '@scrapper-gate/shared/schema';
import React, { useMemo } from 'react';
import { DurationInputFieldProps } from './DurationInputField.types';

const units = Object.values(DurationUnit).map((unit) => ({
  value: unit,
  label: toDisplayText(unit),
}));

export const DurationInputField = ({
  value,
  onChange,
  ...rest
}: DurationInputFieldProps) => {
  const inputValue = useMemo(() => {
    if (value && 'value' in value) {
      return value;
    }

    const newValue = value
      ? Duration.fromDuration(value).toInput()
      : Duration.fromMs(0).toInput();

    onChange?.(newValue);

    return newValue;
  }, [onChange, value]);

  return (
    <TextField
      {...rest}
      value={inputValue?.value}
      onChange={(event) =>
        onChange?.({
          value: saveParseFloat(event.target.value),
          unit: inputValue?.unit ?? DurationUnit.Milliseconds,
        })
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Select
              variant="standard"
              value={inputValue?.unit ?? DurationUnit.Milliseconds}
              onChange={(event) => {
                onChange?.({
                  value: inputValue?.value ?? 0,
                  unit: event.target.value as DurationUnit,
                });
              }}
            >
              {units.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        ),
      }}
    />
  );
};
