import React, { useMemo } from 'react';
import { toDisplayText } from '@scrapper-gate/shared/common';
import { MenuItem } from '@material-ui/core';
import { FormSelect, FormSelectProps } from '../FormSelect/FormSelect';

export interface EnumSelectProps extends FormSelectProps {
  enumObj: Record<string, number | string> | Array<number | string>;
  dictionary?: Record<string | number, string>;
  emptyOptionLabel?: string;
}

export const EnumSelect = ({
  enumObj,
  dictionary = {},
  emptyOptionLabel,
  ...rest
}: EnumSelectProps) => {
  const mappedEnum = useMemo(() => {
    const arr = Array.isArray(enumObj) ? enumObj : Object.values(enumObj);

    return arr.map((item) => ({
      value: item,
      label: dictionary[item] ?? toDisplayText(item.toString()),
    }));
  }, [dictionary, enumObj]);

  return (
    <FormSelect {...rest}>
      {emptyOptionLabel && <MenuItem value="">{emptyOptionLabel}</MenuItem>}
      {mappedEnum.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </FormSelect>
  );
};
