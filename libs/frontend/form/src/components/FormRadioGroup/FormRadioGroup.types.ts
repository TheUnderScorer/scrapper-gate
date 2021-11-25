import { FormFieldProps } from '@scrapper-gate/frontend/form';
import { RadioGroupProps } from '@scrapper-gate/frontend/ui';

export interface FormRadioGroupProps<T>
  extends Omit<RadioGroupProps<T>, 'value' | 'onChange' | 'name'>,
    FormFieldProps<T> {}
