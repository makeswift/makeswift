/**
 * Makeswift page rendering component for Remix
 * 
 * This is a browser-compatible equivalent of @makeswift/runtime/next.Page
 * Optimized to work with Remix routes and APIs
 */
import React, { useMemo } from 'react';
import { runtime } from './runtime';
import { FallbackPage } from '../components/fallback-page';
import { useLocation, useNavigate } from '@remix-run/react';

/**
 * Props for the MakeswiftPage component
 */
interface MakeswiftPageProps {
  snapshot: any;
  children?: React.ReactNode;
}

/**
 * Component to render a Makeswift page from a snapshot
 * 
 * Similar to Next.js App Router's Page component
 */
export function MakeswiftPage({ snapshot, children }: MakeswiftPageProps) {
  // Get location for error reporting
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle missing page case
  if (!snapshot) {
    console.warn('No page snapshot provided to MakeswiftPage component');
    return (
      <FallbackPage 
        pathname={location.pathname}
        title="Page Not Found"
        description="No Makeswift page content was found for this URL."
      />
    );
  }

  // Memoize the page renderer creation to avoid unnecessary re-renders
  const PageRenderer = useMemo(() => {
    try {
      // Create a page renderer from the snapshot using our runtime
      return runtime.createPageRenderer(snapshot);
    } catch (error) {
      console.error('Error creating page renderer:', error);
      return null;
    }
  }, [snapshot]);

  // If we failed to create a page renderer, show an error
  if (!PageRenderer) {
    return (
      <FallbackPage 
        pathname={location.pathname}
        error={new Error('Failed to create page renderer')} 
        title="Error Rendering Page"
        description="There was an error preparing the Makeswift page content."
      />
    );
  }
  
  try {    
    // Render the page content
    return (
      <>
        <div className="makeswift-page-content">
          <PageRenderer />
        </div>
        {children}
      </>
    );
  } catch (error) {
    // Log detailed error for debugging
    console.error('Error rendering Makeswift page:', error);
    
    // Return user-friendly error page with fallback content
    return (
      <FallbackPage 
        pathname={location.pathname}
        error={error instanceof Error ? error : new Error(String(error))} 
        title="Error Rendering Page"
        description="There was an error rendering the Makeswift page content."
      />
    );
  }
}