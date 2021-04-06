import React from 'react';
import ReactDOM from 'react-dom';
import { ApiClientProvider } from '@scrapper-gate/shared-frontend/common';
import { Popup } from './Popup';

ReactDOM.render(
  <React.StrictMode>
    <ApiClientProvider>
      <Popup />
    </ApiClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
