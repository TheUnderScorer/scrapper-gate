import { SnackbarProps as BaseProps } from '@material-ui/core';
import { SnackbarVariant } from '../../types';

export interface SnackbarProps extends BaseProps {
  variant: SnackbarVariant;
}
