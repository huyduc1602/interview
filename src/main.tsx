import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';

// When using a custom domain, we should use the root path as base URL
// Unless there's a specific BASE_URL environment variable set
const baseUrl = import.meta.env.BASE_URL || '/';

// Log the base URL for debugging purposes
console.log('Using base URL:', baseUrl);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);