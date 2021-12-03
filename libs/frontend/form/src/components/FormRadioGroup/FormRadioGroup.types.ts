import { RadioGroupProps } from '@scrapper-gate/frontend/ui';
import { FormFieldProps } from '../../types';

export interface FormRadioGroupProps<T>
  extends Omit<RadioGroupProps<T>, 'value' | 'onChange' | 'name'>,
    FormFieldProps<T> {}
