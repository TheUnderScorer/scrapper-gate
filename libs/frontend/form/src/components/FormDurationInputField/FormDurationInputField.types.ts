import { DurationInputFieldProps } from '@scrapper-gate/frontend/ui';
import { DurationInput } from '@scrapper-gate/shared/schema';
import { FieldProps } from '../../types';

export interface FormDurationInputFieldProps
  extends Omit<DurationInputFieldProps, 'value' | 'onChange'> {
  fieldProps?: FieldProps<DurationInput>;
  name: string;
}
