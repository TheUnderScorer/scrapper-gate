import React, { useCallback } from 'react';
import { Grid, GridSpacing, InputLabel } from '@material-ui/core';
import { TileCheckbox } from '../TileCheckbox/TileCheckbox';
import { Selection } from '@scrapper-gate/frontend/common';
import { ControllerProps, useController } from 'react-hook-form';

export interface CheckboxGroupProps
  extends Pick<ControllerProps, 'name' | 'control' | 'defaultValue'> {
  options: Selection[];
  disabled?: boolean;
  spacing?: GridSpacing;
  label?: string;
}

export const CheckboxGroup = <ValueType extends unknown>({
  name,
  options,
  disabled,
  spacing = 1,
  label: checkboxLabel,
  control,
  defaultValue = [],
}: CheckboxGroupProps) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const handleClick = useCallback(
    (clickedValue: ValueType) => () => {
      let newValue: ValueType[] = value ?? [];

      const isChecked = newValue.includes(clickedValue);

      if (isChecked) {
        newValue = newValue.filter((val) => val !== clickedValue);
      } else {
        newValue = [...newValue, clickedValue];
      }

      onChange(newValue);
    },
    [onChange, value]
  );

  return (
    <Grid container spacing={spacing}>
      {checkboxLabel && (
        <Grid item xs={12}>
          <InputLabel>{checkboxLabel}</InputLabel>
        </Grid>
      )}
      {options.map(({ label, icon, value: itemValue }) => (
        <Grid item key={itemValue}>
          <TileCheckbox
            title={label}
            icon={icon}
            checked={value.includes(itemValue)}
            disabled={disabled}
            onClick={handleClick(itemValue)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
