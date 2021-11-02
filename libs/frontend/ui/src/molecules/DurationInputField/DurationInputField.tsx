import { InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import { Duration, toDisplayText } from '@scrapper-gate/shared/common';
import { DurationUnit } from '@scrapper-gate/shared/schema';
import React, { ChangeEventHandler, useCallback, useMemo } from 'react';
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
  const duration = useMemo(
    () =>
      Duration.fromUnit(
        value?.byEnteredUnit ?? 0,
        value?.enteredUnit ?? DurationUnit.Milliseconds
      ),
    [value]
  );

  const displayValue = useMemo(
    () => duration.byUnit(duration.enteredUnit),
    [duration]
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const value = parseFloat(event.target.value);

      onChange?.(duration.modify(value));
    },
    [duration, onChange]
  );

  return (
    <TextField
      {...rest}
      value={displayValue}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Select
              variant="standard"
              value={value?.enteredUnit ?? DurationUnit.Milliseconds}
              onChange={(event) => {
                onChange?.(
                  Duration.fromUnit(
                    duration.byEnteredUnit,
                    event.target.value as DurationUnit
                  )
                );
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
