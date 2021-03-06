import { Button, ButtonProps, Fab } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { ComponentType } from 'react';

export const PrimaryLightButton: ComponentType<ButtonProps> = styled(Button)(
  ({ theme }) => ({
    '&, &:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
    },
  }),
  {}
);

PrimaryLightButton.defaultProps = {
  variant: 'text',
};

export const PrimaryLightIconButton = styled(Fab)(({ theme }) => ({
  '&.MuiFab-root, &.MuiFab-root:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.light,
    boxShadow: 'none',
  },
}));
//PrimaryLightIconButton.defaultProps = defaultProps;

export const PrimaryIconButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: 'none',

  '&. loading': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
}));
//PrimaryIconButton.defaultProps = defaultProps;

export const CancelButton = Button as ComponentType<ButtonProps>;
CancelButton.defaultProps = {
  variant: 'outlined',
};
