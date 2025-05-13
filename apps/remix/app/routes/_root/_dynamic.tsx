/**
 * Dynamic route handler for Makeswift pages
 */
import { 
  useLoaderData, 
  useParams,
  useRouteError,
  type LoaderFunction,
  type MetaFunction,
} from 'react-router-dom';
// We're not using ReactRuntime directly to avoid build issues
import { client } from '~/makeswift/client';
import { getSiteVersion } from '~/makeswift/utils/site-version';
import { SimpleText } from '~/components/simple-text';
import { ContentCard } from '~/components/content-card';
import { useRemixRuntime } from '~/makeswift/provider';

/**
 * Loader function for Makeswift pages
 */
export const loader: LoaderFunction = async ({ params, request }) => {
  // Extract path information from params and URL
  let pathname = '/';
  const url = new URL(request.url);
  
  // Handle different routing patterns
  if (params['*']) {
    // Catch-all route handling
    pathname = `/${params['*']}`;
  } else if (params.lang && params.path) {
    // Route with language and path params
    pathname = `/${params.path}`;
  } else if (params.lang) {
    // Language param without path (homepage for that language)
    pathname = '/';
  }
  
  // Normalize the pathname (handle trailing slashes consistently)
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  
  // Extract language from params or use default
  const lang = params.lang || 'en';

  console.log(`Processing request for path: ${pathname}, lang: ${lang || 'default'}`);
  
  // Get site version from cookies
  const siteVersion = await getSiteVersion(request);
  
  try {
    // Get page snapshot from Makeswift
    const snapshot = await client.getPageSnapshot(pathname, {
      siteVersion,
      locale: lang,
    });
    
    // If page not found, throw 404
    if (!snapshot) {
      console.log(`No Makeswift page found for path: ${pathname}`);
      throw new Response(null, { status: 404 });
    }
    
    return { 
      snapshot, 
      siteVersion, 
      locale: lang || 'en',
      pathname,
    };
  } catch (error) {
    console.error(`Error fetching Makeswift page for ${pathname}:`, error);
    throw new Response(null, { status: 500 });
  }
};

/**
 * Meta function to set page metadata from Makeswift
 */
export const meta: MetaFunction = ({ data }) => {
  if (!data?.snapshot) return [];
  
  const { document } = data.snapshot;
  
  return [
    { title: document.meta.title || 'Makeswift with React Router' },
    { name: 'description', content: document.meta.description || '' },
    ...(document.meta.keywords ? [{ name: 'keywords', content: document.meta.keywords }] : []),
  ];
};

/**
 * Error boundary component for the dynamic page
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Error Loading Page</h1>
      <p>There was an error loading the Makeswift page at path: {params['*'] || '/'}</p>
      <details style={{ margin: '20px auto', maxWidth: '800px', textAlign: 'left' }}>
        <summary>Error Details</summary>
        <pre style={{ padding: '16px', backgroundColor: '#f5f5f5', overflow: 'auto' }}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </details>
    </div>
  );
}

/**
 * Page component that renders the Makeswift page snapshot
 */
export default function DynamicPage() {
  const { snapshot } = useLoaderData<typeof loader>();
  
  // Add some basic fallback UI for debugging
  if (!snapshot) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>No Makeswift page found</h1>
        <p>The requested page could not be found in Makeswift.</p>
      </div>
    );
  }
  
  // Simple Makeswift page renderer
  return (
    <div className="makeswift-page">
      {snapshot ? (
        <div>
          {/* Framework badge */}
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
          
          {/* Render the page HTML directly */}
          <div dangerouslySetInnerHTML={{ __html: snapshot.document?.html || '' }} />
          
          {/* Render our custom components in a sandbox area */}
          <div style={{ padding: '20px', margin: '20px 0', border: '1px dashed #ccc' }}>
            <h2>Custom Components</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <SimpleText text="This is a simple text component" color="#333" fontSize={16} />
              <ContentCard 
                title="Sample Card" 
                description="This is a sample content card component"
                backgroundColor="#f9fafb"
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>No Makeswift page found</h1>
          <p>The requested page could not be found in Makeswift.</p>
        </div>
      )}
    </div>
  );

}