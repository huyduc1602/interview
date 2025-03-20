import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';

// Detect if we're running on GitHub Pages
const isGitHubPages = window.location.hostname.includes('.github.io') ||
  import.meta.env.VITE_IS_GITHUB_PAGES === true;

// Log routing mode for debugging
console.log(`Using ${isGitHubPages ? 'HashRouter' : 'BrowserRouter'} for routing`);
console.log(`Current hostname: ${window.location.hostname}`);
console.log(`Current pathname: ${window.location.pathname}`);

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