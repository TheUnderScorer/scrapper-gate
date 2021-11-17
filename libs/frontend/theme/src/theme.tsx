import { Delete, PlayArrow } from '@mui/icons-material';
import { createTheme, SimplePaletteColorOptions } from '@mui/material/styles';
import React from 'react';
import { conditionalStopPropagation } from './conditionalStopPropagation';
import { palette } from './palette';

interface ThemeParams {
  isContent?: boolean;
  container?: HTMLElement;
  htmlFontSize: number;
}

export const getTheme = ({ isContent, container, htmlFontSize }: ThemeParams) =>
  createTheme({
    palette,
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          containedPrimary: {
            background: palette.gradients.primaryMainToDark,
            color: (palette.primary as SimplePaletteColorOptions).contrastText,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          primary: {
            '&:not[disabled]': {
              background: palette.gradients.primaryMainToDark,
            },
          },
        },
      },
      MuiPopover: {
        defaultProps: {
          disableEnforceFocus: isContent,
          container,
        },
      },
      MuiTooltip: {
        defaultProps: {
          PopperProps: {
            container,
          },
        },
      },
      MuiModal: {
        defaultProps: {
          disableEnforceFocus: isContent,
          container,
        },
      },
      MuiMenu: {
        defaultProps: {
          container,
          style: {
            pointerEvents: 'all',
          },
        },
      },
      MuiAccordion: {
        variants: [
          {
            props: {
              variant: 'transparent',
            },
            style: {
              background: 'transparent',
              border: 'none',
            },
          },
        ],
      },
      MuiDialog: {
        defaultProps: {
          container,
          disableEnforceFocus: isContent,
          disableAutoFocus: isContent,
          disableRestoreFocus: isContent,
          BackdropProps: {
            style: {
              pointerEvents: 'all',
            },
          },
          PaperProps: {
            style: {
              pointerEvents: 'all',
            },
          },
        },
      },
      MuiInput: {
        defaultProps: {
          onKeyDown: conditionalStopPropagation,
          onKeyUp: conditionalStopPropagation,
          onKeyPress: conditionalStopPropagation,
        },
      },
      MuiTextField: {
        defaultProps: {
          onKeyDown: conditionalStopPropagation,
          onKeyUp: conditionalStopPropagation,
          onKeyPress: conditionalStopPropagation,
        },
      },
    },
    typography: {
      fontSize: 13,
      htmlFontSize,
    },
    zIndex: {
      modal: 1400,
    },
    emojis: {
      empty: '😯',
      error: '😵',
      success: '😁',
    },
    icons: {
      run: <PlayArrow />,
      delete: <Delete />,
    },
  });
