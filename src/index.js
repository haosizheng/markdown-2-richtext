import React from 'react';
import ReactDOM from 'react-dom/client';
// 移除对index.css的引用
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);