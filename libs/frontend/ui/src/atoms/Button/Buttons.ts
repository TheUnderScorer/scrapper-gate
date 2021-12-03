import { Button, ButtonProps } from '@mui/material';
import { ComponentType } from 'react';

export const CancelButton = Button as ComponentType<ButtonProps>;
CancelButton.defaultProps = {
  variant: 'outlined',
};
