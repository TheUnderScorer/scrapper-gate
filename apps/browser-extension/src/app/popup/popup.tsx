import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { useTokensStore } from '../auth/useTokensStore';
import { PopupRoot } from './views/PopupRoot';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <QueryParamProvider>
        <ThemeProvider>
          <ApiClientProvider useTokensStore={useTokensStore}>
            <PopupRoot />
          </ApiClientProvider>
        </ThemeProvider>
      </QueryParamProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
