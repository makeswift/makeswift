/**
 * Fixed entry point for the application to work around the "process is not defined" error
 * This version properly integrates with Makeswift to render dynamic content
 */

// Import React and ReactDOM to ensure we're using them directly
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import our custom Makeswift integration
import { client } from './makeswift/client';
import { runtime } from './makeswift/runtime';
import { MakeswiftProvider } from './makeswift/provider';

// Import our components directly
import { SimpleText } from './components/simple-text/simple-text';
import { ContentCard } from './components/content-card/content-card';
import { FallbackPage } from './components/fallback-page';

// Define component state types
const { useState, useEffect, Suspense } = React;

// Declare MakeswiftPage ahead of runtime to prevent circular dependencies
function SimpleMakeswiftPage({ snapshot, locale = 'en', siteVersion = 'published' }) {
  if (!snapshot) {
    return React.createElement('div', 
      { style: { padding: '2rem', textAlign: 'center' } },
      React.createElement('h1', null, 'Page Not Found'),
      React.createElement('p', null, 'No page snapshot provided.')
    );
  }

  try {
    // Use our custom runtime renderer
    const PageRenderer = runtime.createPageRenderer(snapshot);
    
    return React.createElement(MakeswiftProvider, 
      { locale, siteVersion },
      React.createElement('div', 
        { className: 'makeswift-page-container' },
        React.createElement(PageRenderer, null)
      )
    );
  } catch (error) {
    console.error('Error rendering page:', error);
    
    return React.createElement('div', 
      { style: { padding: '2rem', textAlign: 'center' } },
      React.createElement('h1', null, 'Error Rendering Page'),
      React.createElement('p', null, 'There was an error rendering the Makeswift page.'),
      React.createElement(SimpleText, { 
        text: "Fallback content when rendering fails", 
        fontSize: 18, 
        color: "#333" 
      })
    );
  }
}

// PageRenderer component that dynamically renders Makeswift pages
function PageRenderer({ pathname }) {
  // Use state for page data, loading state, and errors
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch page data when pathname changes
  useEffect(() => {
    // Define async function to fetch page data
    async function fetchPage() {
      try {
        console.log(`Fetching page data for path: ${pathname}`);
        setLoading(true);
        
        // Get the normalized path
        const path = pathname === '/' ? '/' : pathname || '/';
        
        // Fetch the page data from Makeswift
        const snapshot = await client.getPageSnapshot(path, { 
          siteVersion: 'published',
          locale: 'en'
        });
        
        if (snapshot) {
          console.log('Page data fetched successfully:', snapshot);
          setPageData(snapshot);
        } else {
          console.warn(`Page not found for path: ${path}`);
          setError(new Error('Page not found'));
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    // Call the fetch function
    fetchPage();
  }, [pathname]);

  // Loading state
  if (loading) {
    return React.createElement(FallbackPage, {
      pathname,
      title: 'Loading...',
      description: 'Loading Makeswift page content'
    });
  }

  // Error or not found state
  if (error || !pageData) {
    return React.createElement(FallbackPage, {
      pathname,
      error: error,
      title: 'Page Not Found',
      description: 'The Makeswift page you\'re looking for doesn\'t exist.'
    });
  }

  // Try to render the page content using Makeswift
  try {
    // Create wrapper element with navigation and our Makeswift page
    return React.createElement(
      'div', 
      null,
      // Framework badge
      React.createElement('div', { 
        className: 'framework-badge'
      }, 'Remix'),
      
      // Navigation
      React.createElement(
        'div', 
        { 
          style: { 
            padding: '1rem', 
            background: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem'
          } 
        },
        React.createElement('a', { 
          href: '/', 
          style: { 
            color: '#0c4a6e', 
            textDecoration: pathname === '/' ? 'underline' : 'none', 
            fontWeight: 'bold' 
          } 
        }, 'Home'),
        React.createElement('a', { 
          href: '/about', 
          style: { 
            color: '#0c4a6e', 
            textDecoration: pathname === '/about' ? 'underline' : 'none', 
            fontWeight: 'bold' 
          } 
        }, 'About'),
        React.createElement('a', { 
          href: '/sample', 
          style: { 
            color: '#0c4a6e', 
            textDecoration: pathname === '/sample' ? 'underline' : 'none', 
            fontWeight: 'bold' 
          } 
        }, 'Sample')
      ),
      
      // Content container
      React.createElement(
        'div', 
        { style: { padding: '1rem' } },
        React.createElement(SimpleMakeswiftPage, { snapshot: pageData })
      )
    );
  } catch (err) {
    // Log the error for debugging
    console.error('Error rendering Makeswift page:', err);
    
    // Use our fallback page when rendering fails
    return React.createElement(FallbackPage, {
      pathname,
      error: err,
      title: 'Makeswift Rendering Error',
      description: 'There was an error rendering the Makeswift page content.'
    });
  }
}

// Layout component to provide Makeswift context
function AppLayout({ children }) {
  return (
    <MakeswiftProvider siteVersion="published" locale="en">
      {children}
    </MakeswiftProvider>
  );
}

// Dynamic page component to render based on the current path
function DynamicPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <PageRenderer pathname={window.location.pathname} />
      </Suspense>
    </AppLayout>
  );
}

// Create router with dynamic routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <DynamicPage />,
  },
  {
    path: '/sample',
    element: <DynamicPage />,
  },
  {
    path: '/about',
    element: <DynamicPage />,
  },
  {
    path: '*',
    element: <DynamicPage />,
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);