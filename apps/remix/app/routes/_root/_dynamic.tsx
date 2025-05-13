/**
 * Dynamic route handler for Makeswift pages
 */
import { 
  useLoaderData, 
  useParams,
  json, 
  defer,
  type LoaderFunction,
  type MetaFunction,
} from 'react-router-dom';
import { MakeswiftPage } from '@makeswift/remix';
import { client } from '~/makeswift/client';
import { getSiteVersion } from '~/makeswift/utils/site-version';

/**
 * Loader function for Makeswift pages
 */
export const loader: LoaderFunction = async ({ params, request }) => {
  const { lang, '*': path = '' } = params;
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
  
  return defer({ 
    snapshot, 
    siteVersion, 
    locale: lang || 'en',
    pathname,
  });
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
 * Page component that renders the Makeswift page snapshot
 */
export default function DynamicPage() {
  const { snapshot } = useLoaderData<typeof loader>();
  return <MakeswiftPage snapshot={snapshot} />;
}