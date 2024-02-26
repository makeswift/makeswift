/* eslint-disable check-file/filename-naming-convention */
import '../app/globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

import { getInitialData } from '~/client/queries/get-initial-data';
import { BcDataProvider } from '~/providers/bc-data-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type InitialProps = Awaited<ReturnType<typeof App.getInitialProps>>;
type Props = AppProps & InitialProps;

export default function App({ Component, pageProps, bcData }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <main className={`${inter.variable} font-sans`}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <BcDataProvider value={bcData}>
            <Component {...pageProps} />
          </BcDataProvider>
        </QueryClientProvider>
      </SessionProvider>
    </main>
  );
}

App.getInitialProps = async () => {
  const bcData = await getInitialData();

  return {
    bcData,
  };
};
