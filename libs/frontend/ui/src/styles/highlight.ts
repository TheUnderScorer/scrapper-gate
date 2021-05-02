import { css } from '@emotion/react';

export const highlight = (color: string) => css`
  .scrapper-gate-highlight:not(.hidden) {
    background: ${color} !important;
  }
`;
