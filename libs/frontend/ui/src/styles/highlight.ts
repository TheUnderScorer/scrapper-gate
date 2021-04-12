import tinycolor from 'tinycolor2';
import { css } from '@emotion/react';
import { Theme } from '@material-ui/core/styles';
import { StylesFn } from './styles.types';

export const highlight: StylesFn = (theme: Theme) => css`
  .scrapper-gate-highlight:not(.hidden) {
    background: ${tinycolor(theme.palette.primary.dark)
      .setAlpha(0.5)
      .toRgbString()} !important;
  }
`;
