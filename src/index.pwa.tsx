import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from '@components/App/App';
import { createStore } from '@store/store';
import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from '@components/AppErrorBoundary/AppErrorBoundary';

const store = createStore();

ReactDOM.render(
  <AppErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </AppErrorBoundary>,
  document.getElementById('root')
);
