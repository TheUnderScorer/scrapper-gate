import React from 'react';
import ReactDOM from 'react-dom';
import { palette, ThemeProvider } from '@scrapper-gate/frontend/theme';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import {
  hiddenNumericArrows,
  highlight,
  reactFlowBuilderStyles,
  Scoped,
  SnackbarActions,
} from '@scrapper-gate/frontend/ui';
import { SnackbarProvider } from 'notistack';
import { ContentRouter } from '../../extension/contentScript/components/ContentRouter';
import { contentContainer } from '../../extension/contentScript/contentContainer';
import '../../content.css';
import { ContentErrorBoundary } from './ContentErrorBoundary';
import { Content } from './Content';
import { logger } from '@scrapper-gate/frontend/logger';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import 'react-flow-renderer/dist/style.css';
import { Global } from '@emotion/react';
import tinycolor from 'tinycolor2';
import { Palette } from '@material-ui/core/styles/createPalette';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

logger.debug('Starting content script... ;)');

document.body.appendChild(contentContainer);

ReactDOM.render(
  <React.StrictMode>
    <Global
      styles={[
        highlight(
          tinycolor((palette as Palette).primary.dark)
            .setAlpha(0.5)
            .toRgbString()
        ),
      ]}
    />
    <Scoped>
      {(shadowRoot, container) => (
        <ContentErrorBoundary>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ContentRouter>
              <QueryParamProvider>
                <ThemeProvider isContent container={container}>
                  <Global
                    styles={[reactFlowBuilderStyles, hiddenNumericArrows]}
                  />
                  <ApiClientProvider>
                    <SnackbarProvider
                      action={(key) => <SnackbarActions key={key} />}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <Content />
                    </SnackbarProvider>
                  </ApiClientProvider>
                </ThemeProvider>
              </QueryParamProvider>
            </ContentRouter>
          </MuiPickersUtilsProvider>
        </ContentErrorBoundary>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
