import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import {
  hiddenNumericArrows,
  highlight,
  reactFlowBuilderStyles,
  Scoped,
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
import { GlobalStyles } from '@material-ui/core';

logger.debug('Starting content script... ;)');

document.body.appendChild(contentContainer);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <GlobalStyles styles={[highlight]} />
    </ThemeProvider>
    <Scoped>
      {(shadowRoot, container) => (
        <ContentErrorBoundary>
          <ContentRouter>
            <QueryParamProvider>
              <ThemeProvider isContent container={container}>
                <Global
                  styles={[reactFlowBuilderStyles, hiddenNumericArrows]}
                />
                <ApiClientProvider>
                  <SnackbarProvider>
                    <Content />
                  </SnackbarProvider>
                </ApiClientProvider>
              </ThemeProvider>
            </QueryParamProvider>
          </ContentRouter>
        </ContentErrorBoundary>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
