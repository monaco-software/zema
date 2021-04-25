import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Pwa } from '@components/Pwa/Pwa';
import { createStore } from '@store/store';
import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';

const store = createStore();

ReactDOM.render(
  <AppErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <Pwa />
      </BrowserRouter>
    </Provider>
  </AppErrorBoundary>,
  document.getElementById('root')
);
