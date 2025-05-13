/**
 * Root layout component for the application
 */
import { 
  Outlet, 
  useLoaderData,
  json,
  defer,
  type LoaderFunction,
  type MetaFunction,
} from 'react-router-dom';
import { MakeswiftProvider } from '~/makeswift/provider';
import { MakeswiftStyles } from '@makeswift/remix';
import { getSiteVersion } from '~/makeswift/utils/site-version';

// Import styles
import '~/styles/app.css';

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
  
  return defer({
    siteVersion,
    locale: 'en', // Default locale
  });
};

/**
 * Root component
 */
export default function Root() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <MakeswiftStyles />
      </head>
      <body>
        <MakeswiftProvider>
          <Outlet />
        </MakeswiftProvider>
      </body>
    </html>
  );
}