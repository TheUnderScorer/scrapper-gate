import { TextFieldProps } from '@mui/material';
import { DurationInput, Duration } from '@scrapper-gate/shared/schema';

export interface DurationInputFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: DurationInput | Duration;
  onChange?: (value: DurationInput) => unknown;
}
