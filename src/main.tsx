import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';

// Simplify routing handling for GitHub Pages using HashRouter
const isGitHubPages = window.location.hostname.includes('.github.io');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {isGitHubPages ? (
        <HashRouter>
          <App />
        </HashRouter>
      ) : (
        <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
          <App />
        </BrowserRouter>
      )}
    </Provider>
  </React.StrictMode>
);