import React from 'react';
import ReactDOM from 'react-dom';
import { ApiClientProvider } from '@scrapper-gate/shared-frontend/common';
import { Popup } from './components/Popup/Popup';
import { ThemeProvider } from '@scrapper-gate/shared-frontend/theme';
import { HashRouter } from 'react-router-dom';

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

console.log('test');
