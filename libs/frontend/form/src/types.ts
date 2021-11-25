import { UseFieldConfig } from 'react-final-form';
import { UseFieldHasErrorProps } from './hooks/useFieldHasError';

export type FieldProps<T> = UseFieldConfig<T> &
  Pick<UseFieldHasErrorProps, 'showErrorOnlyOnTouched'>;

export interface FormFieldProps<T> {
  fieldProps?: FieldProps<T>;
  name: string;
}

export type FieldNameCreator = (name?: string) => string;
