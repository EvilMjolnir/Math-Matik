import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Global Styles
import './css/base.css';
import './css/scrollbar.css';
import './css/borders.css';
import './css/animations.css';
import './css/holographic.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);