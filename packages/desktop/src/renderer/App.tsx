import React, { useEffect } from 'react';
import CosmosOS from '@cosmos/web/src/App';

declare global {
  interface Window {
    __TAURI__?: any;
  }
}

export function App() {
  useEffect(() => {
    // Check if running in Tauri context
    if (window.__TAURI__) {
      console.log('Running in COSMOS OS Desktop Tauri environment.');
      // Add native tray, menu or filesystem integrations here
    }
  }, []);

  return <CosmosOS />;
}
