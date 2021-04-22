import { ControllerProps } from 'react-hook-form';

export type FieldControllerProps<T> = Pick<
  ControllerProps<T>,
  'defaultValue' | 'rules' | 'control' | 'name'
>;

export type FieldNameCreator = (name: string) => string;
