import React, { FC, ReactNode, useCallback } from 'react';
import { Grid, GridSpacing, InputLabel } from '@material-ui/core';
import { useField } from 'react-final-form';
import { TileRadio } from '../TileRadio/TileRadio';
import { Selection } from '@scrapper-gate/frontend/common';

export interface RadioGroupProps {
  name: string;
  options: Selection[];
  disabled?: boolean;
  spacing?: GridSpacing;
  label?: ReactNode;
}

export const RadioGroup: FC<RadioGroupProps> = <ValueType extends unknown>({
  name,
  options,
  disabled,
  spacing = 1,
  label: radioLabel,
}: RadioGroupProps) => {
  const { input } = useField(name);
  const { onChange } = input;
  const value = input.value as ValueType | null;

  const handleClick = useCallback(
    (selectedValue: ValueType) => () => {
      onChange({
        target: {
          value: selectedValue === value ? undefined : selectedValue,
          name,
        },
      });
    },
    [name, onChange, value]
  );

  return (
    <Grid container spacing={spacing}>
      {radioLabel && (
        <Grid item xs={12}>
          <InputLabel shrink>{radioLabel}</InputLabel>
        </Grid>
      )}
      {options.map(({ label, icon, value: optionValue }) => (
        <Grid item key={optionValue.toString()}>
          <TileRadio
            title={label}
            icon={icon}
            checked={value === optionValue}
            disabled={disabled}
            onClick={handleClick(optionValue as ValueType)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
