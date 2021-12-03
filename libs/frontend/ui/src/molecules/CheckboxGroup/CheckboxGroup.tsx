import React, { FC, useCallback } from 'react';
import { useField } from 'react-final-form';
import { Grid, GridSpacing, InputLabel } from '@mui/material';
import { TileCheckbox } from '../TileCheckbox/TileCheckbox';
import { Selection } from '@scrapper-gate/frontend/common';

export interface CheckboxGroupProps {
  name: string;
  options: Selection[];
  disabled?: boolean;
  spacing?: GridSpacing;
  label?: string;
}

export const CheckboxGroup: FC<CheckboxGroupProps> = <
  ValueType extends unknown
>({
  name,
  options,
  disabled,
  spacing = 1,
  label: checkboxLabel,
}: CheckboxGroupProps) => {
  const { input } = useField(name);
  const { value: values = [] as ValueType[], onChange } = input;

  const handleClick = useCallback(
    (value: ValueType) => () => {
      let newValue: ValueType[] = values ?? [];

      const isChecked = values.includes(value);

      if (isChecked) {
        newValue = newValue.filter((val) => val !== value);
      } else {
        newValue = [...newValue, value];
      }

      onChange({
        target: {
          value: newValue,
          name,
        },
      });
    },
    [name, onChange, values]
  );

  return (
    <Grid container spacing={spacing}>
      {checkboxLabel && (
        <Grid item xs={12}>
          <InputLabel>{checkboxLabel}</InputLabel>
        </Grid>
      )}
      {options.map(({ label, icon, value: itemValue }) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Grid item key={(itemValue as any).toString()}>
          <TileCheckbox
            title={label}
            icon={icon}
            checked={values.includes(itemValue)}
            disabled={disabled}
            onSelect={handleClick(itemValue as ValueType)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
