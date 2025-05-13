/**
 * Dynamic route handler for Makeswift pages
 */
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { MakeswiftPage } from '@makeswift/remix';
import { client } from '~/makeswift/client';
import { getSiteVersion } from '~/makeswift/utils/site-version';

/**
 * Loader function for Makeswift pages
 */
export async function loader({ params, request }: LoaderFunctionArgs) {
  const { lang, path = '' } = params;
  const pathname = '/' + (path || '');
  
  // Get site version from cookies
  const siteVersion = await getSiteVersion(request);
  
  // Get page snapshot from Makeswift
  const snapshot = await client.getPageSnapshot(pathname, {
    siteVersion,
    locale: lang,
  });
  
  // If page not found, throw 404
  if (!snapshot) {
    throw new Response(null, { status: 404 });
  }
  
  return json({ 
    snapshot, 
    siteVersion, 
    locale: lang || 'en',
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
 * Page component that renders the Makeswift page snapshot
 */
export default function Page() {
  const { snapshot } = useLoaderData<typeof loader>();
  return <MakeswiftPage snapshot={snapshot} />;
}