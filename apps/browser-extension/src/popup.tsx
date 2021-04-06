import React from 'react';
import ReactDOM from 'react-dom';
import { ApiClientProvider } from '@scrapper-gate/shared-frontend/common';
import { Popup } from './components/Popup';
import { ThemeProvider } from '@scrapper-gate/shared-frontend/theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <ApiClientProvider>
        <Popup />
      </ApiClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

console.log('test');
