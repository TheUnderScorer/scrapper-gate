import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SnackbarKey, useSnackbar } from 'notistack';
import React from 'react';

const PREFIX = 'SnackbarActions';

const classes = {
  item: `${PREFIX}-item`,
};

const StyledIconButton = styled(IconButton)({
  [`&.${classes.item}`]: {
    pointerEvents: 'all',
  },
});

export interface SnackbarActionsProps {
  key: SnackbarKey;
}

export const SnackbarActions = ({ key }: SnackbarActionsProps) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <StyledIconButton
      color="inherit"
      className={classes.item}
      onClick={() => closeSnackbar(key)}
      size="large"
    >
      <Close />
    </StyledIconButton>
  );
};
