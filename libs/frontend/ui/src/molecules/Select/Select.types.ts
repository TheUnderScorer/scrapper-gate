import { SelectProps as BaseSelectProps } from '@mui/material';

export interface SelectProps<T> extends Omit<BaseSelectProps<T>, 'variant'> {
  chip?: boolean;
  variant?: BaseSelectProps['variant'] | 'plain';
}
