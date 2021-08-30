import { css } from '@emotion/react';
import { Theme } from '@material-ui/core';

export const themeStyles = (theme: Theme) => css`
  #notistack-snackbar .emoji img {
    width: 23px !important;
    height: 23px !important;
    margin-left: ${theme.spacing(1)} !important;
  }

  .MuiPickersBasePicker-pickerView {
    pointer-events: all;
  }
`;
