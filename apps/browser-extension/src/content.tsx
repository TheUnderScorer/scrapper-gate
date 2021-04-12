import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { contentContainer } from './extension/contentScript/contentContainer';
import { ContentRouter } from './extension/contentScript/components/ContentRouter';
import { highlight, Scoped, Styles } from '@scrapper-gate/frontend/ui';
import { SnackbarProvider } from 'notistack';
import { css, Global } from '@emotion/react';
import { Content } from './app/Content/Content';

const contentStyles = css`
  #scrapper_gate_content_root {
    position: fixed;
    z-index: 99999999999;
    width: 100vw;
    height: 100vh;
    top: 0;
    pointer-events: none;

    > div {
      pointer-events: none;
    }
  }
`;

document.body.appendChild(contentContainer);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <Global styles={contentStyles} />
    </ThemeProvider>
    <Scoped>
      {(shadowRoot, container) => (
        <ContentRouter>
          <ThemeProvider isContent container={container}>
            <Styles styleFns={[highlight]} />
            <ApiClientProvider>
              <SnackbarProvider>
                <Content />
              </SnackbarProvider>
            </ApiClientProvider>
          </ThemeProvider>
        </ContentRouter>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
