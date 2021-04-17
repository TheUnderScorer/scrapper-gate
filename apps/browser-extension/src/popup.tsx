import React from 'react';
import ReactDOM from 'react-dom';
import { Popup } from './app/Popup/Popup';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { HashRouter } from 'react-router-dom';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';

console.log('Popup');

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <QueryParamProvider>
        <ThemeProvider>
          <ApiClientProvider>
            <Popup />
          </ApiClientProvider>
        </ThemeProvider>
      </QueryParamProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
