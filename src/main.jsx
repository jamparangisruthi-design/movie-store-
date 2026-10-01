import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { WatchPartyProvider } from './context/WatchPartyContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WatchPartyProvider>
      <App />
    </WatchPartyProvider>
  </React.StrictMode>
);
