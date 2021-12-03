import { UseFieldConfig } from 'react-final-form';
import { UseFieldErrorProps } from './hooks/useFieldError';

export type FieldProps<T> = UseFieldConfig<T> &
  Pick<UseFieldErrorProps, 'showErrorOnlyOnTouched'>;

export interface FormFieldProps<T> {
  // Props that will be passed to "useField" hook
  fieldProps?: FieldProps<T>;
  name: string;
}

export type FieldNameCreator = (name?: string) => string;
