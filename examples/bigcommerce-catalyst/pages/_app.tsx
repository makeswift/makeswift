/* eslint-disable check-file/filename-naming-convention */
import '../app/globals.css';

import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type Props = AppProps;

export default function App({ Component, pageProps }: Props) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
