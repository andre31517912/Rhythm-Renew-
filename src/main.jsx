import React from 'react';
import ReactDOM from 'react-dom/client';
import RhythmApp from '../rhythm-app.jsx';

// Polyfill window.storage using localStorage
window.storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value !== null ? { value } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
  },
  async delete(key) {
    localStorage.removeItem(key);
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RhythmApp />
  </React.StrictMode>
);
