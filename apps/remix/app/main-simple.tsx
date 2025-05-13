/**
 * Simple entry point for demonstration purposes
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Create a simple router
const router = createBrowserRouter([
  {
    path: '/',
    element: <div>
      <h1>Makeswift Remix Integration Demo</h1>
      <p>This is a simple demonstration of the Makeswift Remix adapter.</p>
    </div>,
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);