import { Selection } from '@scrapper-gate/frontend/common';
import React, { useMemo } from 'react';
import { toDisplayText } from '@scrapper-gate/shared/common';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { FormSelect, FormSelectProps } from '../FormSelect/FormSelect';

export interface EnumSelectProps extends FormSelectProps<string> {
  enumObj: Record<string, number | string> | Array<number | string>;
  dictionary?: Record<string, Pick<Partial<Selection>, 'label' | 'icon'>>;
  emptyOptionLabel?: string;
}

export const EnumSelect = ({
  enumObj,
  dictionary = {},
  emptyOptionLabel,
  ...rest
}: EnumSelectProps) => {
  const { enumDictionary, enumArray } = useMemo(() => {
    const arr = Array.isArray(enumObj) ? enumObj : Object.values(enumObj);

    const enumDictionary = arr.reduce((acc, key) => {
      const keyAsString = key.toString();

      return {
        ...acc,
        [key]: {
          value: keyAsString,
          label: dictionary[key]?.label ?? toDisplayText(keyAsString),
          icon: dictionary[key]?.icon,
        },
      };
    }, {} as Record<string, Selection<string>>);

    const enumArray = Object.values(enumDictionary);

    return {
      enumDictionary,
      enumArray,
    };
  }, [dictionary, enumObj]);

  return (
    <FormSelect
      {...rest}
      renderValue={(value) => {
        return typeof value === 'string'
          ? enumDictionary[value]?.label ?? null
          : null;
      }}
    >
      {emptyOptionLabel && <MenuItem value="">{emptyOptionLabel}</MenuItem>}
      {enumArray.map((item) => (
        <MenuItem key={item.value} value={item.value} data-value={item.value}>
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText>{item.label}</ListItemText>
        </MenuItem>
      ))}
    </FormSelect>
  );
};
