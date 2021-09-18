import { SnackbarProps as BaseProps } from '@mui/material';
import { SnackbarVariant } from '../../types';

export interface SnackbarProps extends BaseProps {
  variant: SnackbarVariant;
}
