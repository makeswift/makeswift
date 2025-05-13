/**
 * Entry point for the application
 * 
 * This file is responsible for bootstrapping the Remix client-side application
 * It implements dynamic routing similar to Next.js App Router
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

// Import Makeswift components and runtime
import './makeswift/components';
import { SimpleText } from './components/simple-text/simple-text';
import { ContentCard } from './components/content-card/content-card';

// Log startup information
console.log('Makeswift + Remix app starting...');

// Global error handler to catch runtime errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Handle "process is not defined" errors
  if (event.error && event.error.toString().includes('process is not defined')) {
    console.error('Process is not defined error detected. This occurs when Node.js APIs are used in browser context.');
    event.preventDefault();
  }
});

// Add debug information to window for troubleshooting
if (typeof window !== 'undefined') {
  // Make components available globally for testing
  window.SimpleText = SimpleText;
  window.ContentCard = ContentCard;
  
  // Store debugging information
  window.MakeswiftDebug = {
    startTime: new Date().toISOString(),
    environment: 'browser',
    url: window.location.href,
    routes: routes.map(r => r.path)
  };
  
  // Add visual debug element
  window.addEventListener('load', () => {
    try {
      const debugEl = document.createElement('div');
      debugEl.style.position = 'fixed';
      debugEl.style.bottom = '10px';
      debugEl.style.right = '10px';
      debugEl.style.padding = '5px 10px';
      debugEl.style.background = '#333';
      debugEl.style.color = '#fff';
      debugEl.style.zIndex = '9999';
      debugEl.style.borderRadius = '4px';
      debugEl.style.fontSize = '12px';
      debugEl.textContent = `Makeswift + Remix: ${window.location.pathname}`;
      document.body.appendChild(debugEl);
      
      // Add a test content element
      const testContent = document.createElement('div');
      testContent.style.margin = '20px';
      testContent.style.padding = '20px';
      testContent.style.border = '1px solid #ccc';
      testContent.style.borderRadius = '4px';
      testContent.innerHTML = `
        <h1>Makeswift + Remix Test Content</h1>
        <p>This element confirms the application is rendering properly.</p>
        <p>Path: ${window.location.pathname}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `;
      
      const root = document.getElementById('root');
      if (root && root.childNodes.length === 0) {
        root.appendChild(testContent);
      }
    } catch (err) {
      console.error('Failed to add debug element:', err);
    }
  });
}

// Create the router with defined routes
const router = createBrowserRouter(routes);

// Render the application
const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    console.log('Mounting React app to #root element');
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render React app:', error);
    
    // Fallback rendering if the normal React rendering fails
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Makeswift + Remix</h1>
        <p>There was an error rendering the React application.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">
          ${error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    `;
  }
}