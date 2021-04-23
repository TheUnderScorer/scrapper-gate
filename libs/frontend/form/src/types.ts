import { ControllerProps } from 'react-hook-form';
import { UseFieldConfig } from 'react-final-form';

export type FieldControllerProps<T> = Pick<
  ControllerProps<T>,
  'defaultValue' | 'rules' | 'control' | 'name' | 'shouldUnregister'
>;

export type FieldProps<T> = UseFieldConfig<T>;

export type FieldNameCreator = (name: string) => string;
