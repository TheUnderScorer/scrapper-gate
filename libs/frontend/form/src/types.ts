import { UseFieldConfig } from 'react-final-form';

export type FieldProps<T> = UseFieldConfig<T>;

export type FieldNameCreator = (name: string) => string;
