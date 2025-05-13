/**
 * Root layout component for the application
 */
import React, { useEffect } from 'react';
import { 
  Outlet, 
  useLoaderData,
  useRouteLoaderData,
  type LoaderFunction,
  type MetaFunction,
  useNavigate,
  useLocation,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';
import { MakeswiftProvider } from '~/makeswift/provider';
// Removed MakeswiftStyles import due to package build issues
import { getSiteVersion } from '~/makeswift/utils/site-version';
import { MAKESWIFT_SITE_API_KEY } from '~/makeswift/env';
import { FallbackPage } from '~/components/fallback-page';

// Import styles
import '~/styles/app.css';

/**
 * Route ID for the root layout
 */
export const id = 'root';

/**
 * Meta function for the root
 */
export const meta: MetaFunction = () => {
  return [
    { title: 'Makeswift + React Router' },
    { name: 'description', content: 'Makeswift integration with React Router v7' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ];
};

/**
 * Root loader function
 */
export const loader: LoaderFunction = async ({ request }) => {
  const siteVersion = await getSiteVersion(request);
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  return {
    siteVersion,
    locale: 'en', // Default locale
    pathname,
  };
};

/**
 * Error boundary for handling route errors
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Log error for debugging
  useEffect(() => {
    console.error('Root error boundary caught error:', error);
  }, [error]);

  // Handle route errors (404, etc)
  if (isRouteErrorResponse(error)) {
    return (
      <FallbackPage
        pathname={location.pathname}
        title={`${error.status} ${error.statusText}`}
        description={error.data?.message || `We couldn't find the page you're looking for.`}
        error={new Error(`Route error: ${error.status} ${error.statusText}`)} 
      />
    );
  }

  // Handle other errors
  return (
    <FallbackPage
      pathname={location.pathname}
      title="Application Error"
      description="We're sorry, but something went wrong. Please try again later."
      error={error instanceof Error ? error : new Error(String(error))}
    />
  );
}

/**
 * Root component
 */
export default function Root() {
  // Safely get loader data with fallbacks for client-side rendering
  let data;
  try {
    data = useLoaderData<typeof loader>();
  } catch (error) {
    console.warn("Failed to load data in Root component:", error);
    // Provide fallback data for client-side rendering
    data = {
      siteVersion: 'published',
      locale: 'en',
      pathname: typeof window !== 'undefined' ? window.location.pathname : '/'
    };
  }
  
  const isDebug = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).has('debug') 
    : false;
  
  // Ensure we have valid values with fallbacks
  const siteVersion = data?.siteVersion || 'published';
  const locale = data?.locale || 'en';
  
  return (
    <MakeswiftProvider 
      siteVersion={siteVersion}
      locale={locale}
    >
      {/* Framework badge for testing */}
      <div className="framework-badge" style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        background: '#0c4a6e', 
        color: 'white', 
        padding: '4px 8px', 
        fontSize: '12px',
        zIndex: 9998 
      }}>Remix</div>
      
      {/* Debug info */}
      {isDebug && (
        <div className="makeswift-debug" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          background: '#f0f9ff',
          padding: '8px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace',
          border: '1px solid #0c4a6e'
        }}>
          <div>Path: {data.pathname}</div>
          <div>API Key: {MAKESWIFT_SITE_API_KEY.substring(0, 6)}...{MAKESWIFT_SITE_API_KEY.substring(MAKESWIFT_SITE_API_KEY.length - 4)}</div>
          <div>Version: {data.siteVersion}</div>
          <div>Locale: {data.locale}</div>
        </div>
      )}
      
      <Outlet />
    </MakeswiftProvider>
  );
}