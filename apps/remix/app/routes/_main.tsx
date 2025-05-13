/**
 * Root layout for the Remix app
 */
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/react';
import { MakeswiftProvider } from '~/makeswift/provider';
import { MakeswiftStyles } from '@makeswift/remix';
import { getSiteVersion } from '~/makeswift/utils/site-version';
import styles from './styles/app.css';

export const meta: MetaFunction = () => {
  return [
    { title: 'Makeswift + Remix' },
    { name: 'description', content: 'Makeswift integration with Remix' },
  ];
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

/**
 * Root loader function that gets site version and default locale
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const siteVersion = await getSiteVersion(request);
  
  return json({
    siteVersion,
    locale: 'en', // Default locale
  });
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <MakeswiftStyles />
      </head>
      <body>
        <MakeswiftProvider>
          <Outlet />
        </MakeswiftProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}