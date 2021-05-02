import tinycolor from 'tinycolor2';
import { css } from '@emotion/react';
import { Theme } from '@material-ui/core/styles';
import { StylesFn } from './styles.types';

export const highlight = (color: string) => css`
  .scrapper-gate-highlight:not(.hidden) {
    background: ${color} !important;
  }
`;
