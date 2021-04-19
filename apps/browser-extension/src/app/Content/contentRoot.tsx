import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { Scoped } from '@scrapper-gate/frontend/ui';
import { SnackbarProvider } from 'notistack';
import '../../content.css';
import { ContentRouter } from '../../extension/contentScript/components/ContentRouter';
import { contentContainer } from '../../extension/contentScript/contentContainer';
import { Content } from './Content';

console.log('Starting content script...');

ReactDOM.render(
  <React.StrictMode>
    <Scoped>
      {(shadowRoot, container) => (
        <ContentRouter>
          <ThemeProvider isContent container={container}>
            <ApiClientProvider>
              <SnackbarProvider>
                <div>
                  <Content />
                </div>
              </SnackbarProvider>
            </ApiClientProvider>
          </ThemeProvider>
        </ContentRouter>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
