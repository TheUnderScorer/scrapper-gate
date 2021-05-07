import { UseFieldConfig } from 'react-final-form';
import { UseFieldHasErrorProps } from './hooks/useFieldHasError';

export type FieldProps<T> = UseFieldConfig<T> &
  Pick<UseFieldHasErrorProps, 'showErrorOnlyOnTouched'>;

export type FieldNameCreator = (name: string) => string;
