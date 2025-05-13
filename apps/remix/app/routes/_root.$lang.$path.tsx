/**
 * Dynamic route handler for Makeswift pages in Remix
 * 
 * This implementation is based on the Next.js App Router approach:
 * - Uses dynamic route parameters for language and path
 * - Fetches page data from Makeswift API
 * - Renders the page using MakeswiftPage component
 */
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useRouteError, useLocation, isRouteErrorResponse } from '@remix-run/react';
import { client } from '~/makeswift/client';
import { getSiteVersion } from '~/makeswift/utils/site-version';
import { MakeswiftPage } from '~/makeswift/page';
import { MakeswiftProvider } from '~/makeswift/provider';
import { FallbackPage } from '~/components/fallback-page';

/**
 * Loader function for Makeswift pages
 * 
 * Similar to Next.js getStaticProps/getServerSideProps
 */
export async function loader({ params, request }: LoaderFunctionArgs) {
  // Get parameters from the URL
  const { lang = 'en', path = '' } = params;
  
  // Create a normalized path for Makeswift
  // Similar to Next.js path normalization
  const pathname = '/' + (path || '');
  
  console.log(`Loading Makeswift page: ${pathname} (locale: ${lang})`);
  
  // Get site version from cookies (published/preview)
  const siteVersion = await getSiteVersion(request);
  
  // Fetch the page data from Makeswift
  const snapshot = await client.getPageSnapshot(pathname, {
    siteVersion,
    locale: lang,
  });
  
  // Handle page not found scenario
  if (!snapshot) {
    console.warn(`Page not found: ${pathname}`);
    throw new Response(null, { status: 404 });
  }
  
  // Return the data to be used by the component
  return json({ 
    snapshot, 
    siteVersion, 
    locale: lang,
    pathname,
  });
}

/**
 * Meta function to set page metadata from Makeswift
 */
export const meta: MetaFunction = ({ data }) => {
  if (!data?.snapshot) return [];
  
  const { document } = data.snapshot;
  
  return [
    { title: document.meta.title || 'Makeswift with Remix' },
    { name: 'description', content: document.meta.description || '' },
    ...(document.meta.keywords ? [{ name: 'keywords', content: document.meta.keywords }] : []),
  ];
};

/**
 * Error boundary for dynamic route errors
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  
  // Handle 404 errors
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <FallbackPage
        pathname={location.pathname}
        title="Page Not Found"
        description="The Makeswift page you're looking for doesn't exist."
        error={new Error(`Page not found: ${location.pathname}`)}
      />
    );
  }
  
  // Handle other errors
  return (
    <FallbackPage
      pathname={location.pathname}
      title="Error Loading Page"
      description="We encountered an error while trying to load this Makeswift page."
      error={error instanceof Error ? error : new Error(String(error))}
    />
  );
}

/**
 * Page component that renders the Makeswift page snapshot
 * 
 * Similar to the Next.js Page component approach
 */
export default function Page() {
  // Load data from the loader function
  const data = useLoaderData<typeof loader>();
  
  // The snapshot is fetched ONLY on the server side in the loader function
  // Client-side just receives and uses the snapshot without refetching
  return (
    <MakeswiftProvider locale={data.locale} siteVersion={data.siteVersion}>
      <div className="makeswift-page">
        <MakeswiftPage snapshot={data.snapshot} />
      </div>
    </MakeswiftProvider>
  );
}