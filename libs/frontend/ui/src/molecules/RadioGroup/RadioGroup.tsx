import React, { FC, ReactNode, useCallback } from 'react';
import { Grid, GridSpacing, InputLabel } from '@material-ui/core';
import { useField } from 'react-final-form';
import { TileRadio } from '../TileRadio/TileRadio';
import { Selection } from '@scrapper-gate/frontend/common';
import { TileRadioProps } from '../TileRadio/TileRadio.types';

export interface RadioGroupProps {
  name: string;
  options: Selection[];
  disabled?: boolean;
  spacing?: GridSpacing;
  label?: ReactNode;
  radioProps?: Pick<
    TileRadioProps,
    'width' | 'height' | 'className' | 'checkedBackgroundColor'
  >;
}

export const RadioGroup: FC<RadioGroupProps> = <ValueType extends unknown>({
  name,
  options,
  disabled,
  spacing = 1,
  label: radioLabel,
  radioProps,
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
      {options.map(({ label, icon, value: optionValue, description }) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Grid item key={(optionValue as any).toString()}>
          <TileRadio
            description={description}
            title={label}
            icon={icon}
            checked={value === optionValue}
            disabled={disabled}
            onClick={handleClick(optionValue as ValueType)}
            {...radioProps}
          />
        </Grid>
      ))}
    </Grid>
  );
};
