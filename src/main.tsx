import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

console.log('Starting CV application...');

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('Root element found, creating React app...');
  
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  
  // Fallback error display
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; color: #111;">
        <h1 style="color: #d00; font-size: 2rem;">Application Failed to Load</h1>
        <p style="font-size: 1.2rem;">A critical error prevented the application from starting.</p>
        <h2 style="margin-top: 2rem;">Error Details:</h2>
        <pre style="background: #fee; color: #d00; border: 1px solid #d00; padding: 1rem; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; font-size: 1rem;">${(error as Error)?.stack || (error as Error)?.message || String(error)}</pre>
      </div>
    `;
  }
} 