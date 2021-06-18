import { Global } from '@emotion/react';
import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { logger } from '@scrapper-gate/frontend/logger';
import { palette, ThemeProvider } from '@scrapper-gate/frontend/theme';
import {
  hiddenNumericArrows,
  highlight,
  reactFlowBuilderStyles,
  Scoped,
  SnackbarActions,
} from '@scrapper-gate/frontend/ui';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-flow-renderer/dist/style.css';
import '../../content.css';
import { ContentRouter } from '../../extension/contentScript/components/ContentRouter';
import { contentContainer } from '../../extension/contentScript/contentContainer';
import { Content } from './Content';
import { ContentErrorBoundary } from './ContentErrorBoundary';

logger.debug('Starting content script... ;)');

document.body.appendChild(contentContainer);

ReactDOM.render(
  <React.StrictMode>
    <Global styles={[highlight(palette.primaryLight)]} />
    <Scoped>
      {(shadowRoot, container) => (
        <ContentErrorBoundary>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          </LocalizationProvider>
        </ContentErrorBoundary>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
