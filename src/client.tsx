import './index.css';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from '@components/App/App';
import { createStore } from '@store/store';
import { PreloadedState } from '@store/types';
import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';

declare global {
  interface Window {
    __SERVER_STATE__?: string;
  }
}

const state = window.__SERVER_STATE__ as PreloadedState;
delete window.__SERVER_STATE__;

const store = createStore(state);

hydrate(
  <AppErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </AppErrorBoundary>,

  document.getElementById('root')
);
