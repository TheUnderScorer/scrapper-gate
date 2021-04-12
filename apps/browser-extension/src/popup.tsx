import React from 'react';
import ReactDOM from 'react-dom';
import { Popup } from './app/Popup/Popup';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { HashRouter } from 'react-router-dom';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';

console.log('Popup');

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <ApiClientProvider>
          <Popup />
        </ApiClientProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
