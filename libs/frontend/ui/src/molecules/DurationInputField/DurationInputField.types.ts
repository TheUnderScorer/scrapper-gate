import { TextFieldProps } from '@mui/material';
import { Duration } from '@scrapper-gate/shared/common';

export interface DurationInputFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: Duration;
  onChange?: (value: Duration) => unknown;
}
