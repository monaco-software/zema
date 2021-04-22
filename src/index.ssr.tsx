import './index.css';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from '@components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { createStore, RootState } from '@store/store';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';

declare global {
  interface Window {
    __SERVER_STATE__?: RootState;
  }
}

const state = window.__SERVER_STATE__;
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
