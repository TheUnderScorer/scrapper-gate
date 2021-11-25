import {
  FormHelperText,
  Grid,
  GridSpacing,
  InputLabel,
  TextFieldProps,
} from '@mui/material';
import { Selection } from '@scrapper-gate/frontend/common';
import React, { ReactNode, useCallback } from 'react';
import { TileRadio } from '../TileRadio/TileRadio';
import { TileRadioProps } from '../TileRadio/TileRadio.types';

export interface RadioGroupProps<T>
  extends Pick<TextFieldProps, 'error' | 'helperText'> {
  name?: string;
  options: Selection[];
  disabled?: boolean;
  spacing?: GridSpacing;
  label?: ReactNode;
  radioProps?: Pick<
    TileRadioProps,
    'width' | 'height' | 'className' | 'checkedBackgroundColor' | 'sx'
  >;
  onChange?: (selectedValue?: T) => unknown;
  value?: T;
}

export const RadioGroup = <ValueType extends unknown>({
  name,
  options,
  disabled,
  spacing = 1,
  label: radioLabel,
  radioProps,
  onChange,
  value,
  error,
  helperText,
}: RadioGroupProps<ValueType>) => {
  const handleClick = useCallback(
    (selectedValue: ValueType) => () => {
      onChange?.(selectedValue === value ? undefined : selectedValue);
    },
    [onChange, value]
  );

  return (
    <Grid direction="column" container spacing={spacing}>
      {radioLabel && (
        <Grid item xs={12}>
          <InputLabel shrink>{radioLabel}</InputLabel>
        </Grid>
      )}
      <Grid item container spacing={spacing}>
        {options.map(({ label, icon, value: optionValue, description }) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Grid item key={(optionValue as any).toString()}>
            <TileRadio
              description={description}
              title={label}
              icon={icon}
              checked={value === optionValue}
              disabled={disabled}
              onSelect={handleClick(optionValue as ValueType)}
              {...radioProps}
              name={name}
              error={error}
            />
          </Grid>
        ))}
      </Grid>
      {helperText && (
        <Grid item>
          <FormHelperText error={error}>{helperText}</FormHelperText>
        </Grid>
      )}
    </Grid>
  );
};
