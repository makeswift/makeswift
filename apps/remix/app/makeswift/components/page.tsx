import React from 'react'
import { useLocation } from 'react-router'
import { useMakeswift } from './simplified-provider'

// Define a type for the snapshot structure
interface PageProps {
  snapshot: {
    id?: string
    elements?: Record<string, any>
    root?: string
    [key: string]: any
  }
}

/**
 * A simplified version of the Makeswift Page component that properly renders
 * with React 19 in a Remix app
 */
export function RemixPage({ snapshot }: PageProps) {
  const location = useLocation()
  const makeswift = useMakeswift()
  
  // Print debugging info
  console.log(`Rendering RemixPage at path: ${location.pathname}`)
  
  if (!snapshot) {
    return <div>No page data available</div>
  }

  // Extract high-level information about the page from the snapshot
  const pageId = snapshot.id || 'unknown'
  const elementCount = snapshot.elements ? Object.keys(snapshot.elements).length : 0
  const rootElementId = snapshot.root || null
  const pageMetadata = snapshot.metadata || {}
  const pageTitle = pageMetadata.title || 'Makeswift Page'
  
  // For now, we're going to render a basic content area with information about the snapshot
  // This will be replaced with actual Makeswift content rendering logic later
  return (
    <div className="makeswift-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{pageTitle}</h1>
        <p style={{ color: '#666' }}>Path: {location.pathname}</p>
        {makeswift.previewMode && <div style={{ background: '#fff8e1', padding: '0.5rem', borderRadius: '4px', display: 'inline-block' }}>Preview Mode</div>}
      </header>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Page Information</h2>
        <ul>
          <li><strong>Page ID:</strong> {pageId}</li>
          <li><strong>Elements Count:</strong> {elementCount}</li>
          <li><strong>Root Element ID:</strong> {rootElementId || 'None'}</li>
          <li><strong>Locale:</strong> {makeswift.locale || 'Default'}</li>
        </ul>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Snapshot Structure</h2>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '4px',
          overflowX: 'auto',
          maxHeight: '300px'
        }}>
          <pre>
            {JSON.stringify({
              id: snapshot.id,
              root: snapshot.root,
              metadata: snapshot.metadata,
              elementCount,
              elementKeys: snapshot.elements ? Object.keys(snapshot.elements) : [],
            }, null, 2)}
          </pre>
        </div>
      </div>
      
      <div style={{ color: '#666', fontSize: '0.875rem', marginTop: '2rem', borderTop: '1px solid #eaeaea', paddingTop: '1rem' }}>
        <p>This is a temporary simplified implementation during the decoupling process.</p>
        <p>In the future, this will render the actual Makeswift page content with all components.</p>
      </div>
    </div>
  )
}