/**
 * Fallback page component that renders when Makeswift integration fails
 * This avoids using Makeswift APIs and provides a clean error page
 */
import React from 'react';
import { Link } from '@remix-run/react';
import { SimpleText } from '../simple-text/simple-text';
import { ContentCard } from '../content-card/content-card';

interface FallbackPageProps {
  pathname: string;
  error?: Error | null;
  title?: string;
  description?: string;
  showErrorDetails?: boolean;
}

export function FallbackPage({ 
  pathname, 
  error = null, 
  title = 'Makeswift Page', 
  description = 'Makeswift + Remix Integration',
  showErrorDetails = true // Default to showing error details if process.env is undefined
}: FallbackPageProps) {
  // Determine if we should be in development or production mode
  // Use a safe check that works even if process.env is undefined
  const isDev = typeof process !== 'undefined' 
    ? process.env?.NODE_ENV !== 'production' 
    : true; // Default to development mode for better debugging
  
  // Get a simpler error message for production
  const errorMessage = error?.message || 'An error occurred';
  
  // Log error to console in development
  if (error && isDev) {
    console.error('Fallback page error:', error);
  }
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {/* Framework badge */}
      <div className="framework-badge" style={{ 
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        backgroundColor: '#121212', 
        color: 'white',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        margin: '0 0 1rem'
      }}>Remix</div>
      
      {/* Page header */}
      <h1 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{title}</h1>
      <p style={{ fontSize: '1.125rem', color: '#4b5563', margin: '0.5rem 0 1.5rem' }}>{description}</p>
      
      {/* Path info */}
      <div style={{ margin: '1rem 0', padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '0.25rem' }}>
        <p><strong>Current path:</strong> {pathname}</p>
      </div>
      
      {/* Error display for development */}
      {error && showErrorDetails && (
        <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#b91c1c', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0 }}>Error Details</h3>
          <p><strong>Message:</strong> {errorMessage}</p>
          {error.stack && (
            <>
              <p><strong>Stack Trace:</strong></p>
              <pre style={{ padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.25rem', maxHeight: '200px', overflow: 'auto', fontSize: '0.875rem' }}>
                {error.stack}
              </pre>
            </>
          )}
        </div>
      )}
      
      {/* Production error message */}
      {error && !showErrorDetails && (
        <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#b91c1c' }}>
          <p>We encountered an error while trying to render this page. Please try again later.</p>
        </div>
      )}
      
      {/* Demo content using our Makeswift components */}
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <SimpleText 
          text="This is a demonstration of Makeswift components" 
          fontSize={24} 
          color="#0c4a6e"
        />
        
        <div style={{ marginTop: '1rem' }}>
          <ContentCard 
            title="Makeswift Content Card"
            description="This is a sample content card component that demonstrates Makeswift integration with Remix."
            backgroundColor="#f0f9ff"
            borderRadius={8}
            padding={20}
            textAlign="center"
          />
        </div>
      </div>
      
      {/* Navigation - using Remix Link component */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Navigation:</h2>
        <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" prefetch="intent" style={{ 
            color: '#0c4a6e', 
            textDecoration: pathname === '/' ? 'underline' : 'none', 
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            backgroundColor: pathname === '/' ? '#e0f2fe' : 'transparent'
          }}>Home</Link>
          <Link to="/about" prefetch="intent" style={{ 
            color: '#0c4a6e', 
            textDecoration: pathname === '/about' ? 'underline' : 'none', 
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            backgroundColor: pathname === '/about' ? '#e0f2fe' : 'transparent'
          }}>About</Link>
          <Link to="/sample" prefetch="intent" style={{ 
            color: '#0c4a6e', 
            textDecoration: pathname === '/sample' ? 'underline' : 'none', 
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            backgroundColor: pathname === '/sample' ? '#e0f2fe' : 'transparent'
          }}>Sample</Link>
        </nav>
      </div>
      
      {/* Footer with timestamp */}
      <div style={{ marginTop: '3rem', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>Rendered at: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}