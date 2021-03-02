import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { store } from '@store/store';
import { Provider } from 'react-redux';
import { App } from '@components/App/App';
import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';

ReactDOM.render(
  <AppErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </AppErrorBoundary>,
  document.getElementById('root'),
);
