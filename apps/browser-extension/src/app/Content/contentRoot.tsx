import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { Scoped } from '@scrapper-gate/frontend/ui';
import { SnackbarProvider } from 'notistack';
import { ContentRouter } from '../../extension/contentScript/components/ContentRouter';
import { contentContainer } from '../../extension/contentScript/contentContainer';
import '../../content.css';
import { ContentErrorBoundary } from './ContentErrorBoundary';
import { Content } from './Content';
import { logger } from '@scrapper-gate/frontend/logger';

logger.debug('Starting content script... ;)');

document.body.appendChild(contentContainer);

ReactDOM.render(
  <React.StrictMode>
    <Scoped>
      {(shadowRoot, container) => (
        <ContentErrorBoundary>
          <ContentRouter>
            <ThemeProvider isContent container={container}>
              <ApiClientProvider>
                <SnackbarProvider>
                  <Content />
                </SnackbarProvider>
              </ApiClientProvider>
            </ThemeProvider>
          </ContentRouter>
        </ContentErrorBoundary>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
