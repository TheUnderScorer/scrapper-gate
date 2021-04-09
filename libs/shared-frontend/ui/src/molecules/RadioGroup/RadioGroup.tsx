import React, { ReactNode, useCallback } from 'react';
import { Grid, GridSpacing, InputLabel } from '@material-ui/core';
import { TileRadio } from '../TileRadio/TileRadio';
import { ControllerProps, useController } from 'react-hook-form';
import { Selection } from '@scrapper-gate/shared-frontend/common';

export interface RadioGroupProps
  extends Pick<ControllerProps, 'control' | 'name' | 'defaultValue'> {
  options: Selection[];
  disabled?: boolean;
  spacing?: GridSpacing;
  label?: ReactNode;
}

export const RadioGroup = <ValueType extends unknown>({
  name,
  options,
  disabled,
  spacing = 1,
  control,
  defaultValue,
  label: radioLabel,
}: RadioGroupProps) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const handleClick = useCallback(
    (selectedValue: ValueType) => () => {
      onChange(selectedValue === value ? '' : selectedValue);
    },
    [onChange, value]
  );

  return (
    <Grid container spacing={spacing}>
      {radioLabel && (
        <Grid item xs={12}>
          <InputLabel shrink>{radioLabel}</InputLabel>
        </Grid>
      )}
      {options.map(({ label, icon, value: optionValue }) => (
        <Grid item key={optionValue}>
          <TileRadio
            title={label}
            icon={icon}
            checked={value === optionValue}
            disabled={disabled}
            onClick={handleClick(optionValue)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
