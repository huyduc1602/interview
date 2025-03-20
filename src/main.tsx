import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';

// Đơn giản hóa việc xác định baseUrl dựa trên môi trường
const isGitHubPages = window.location.hostname.includes('.github.io');
const baseUrl = isGitHubPages ? import.meta.env.BASE_URL || '/' : '/';

// Log the base URL for debugging purposes
console.log('Using base URL:', baseUrl);
console.log('Current hostname:', window.location.hostname);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);