import { DurationInputFieldProps } from '@scrapper-gate/frontend/ui';
import { DurationInput } from '@scrapper-gate/shared/schema';
import { FormFieldProps } from '../../types';

export interface FormDurationInputFieldProps
  extends Omit<DurationInputFieldProps, 'value' | 'onChange' | 'name'>,
    FormFieldProps<DurationInput> {}
