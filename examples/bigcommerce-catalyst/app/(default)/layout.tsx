import { PropsWithChildren, Suspense } from 'react';

import { Footer } from '~/components/footer/server';
import { Header } from '~/components/header/server';
import { ProductSheet } from '~/components/product-sheet';

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="flex-1 px-6 2xl:container sm:px-10 lg:px-12 2xl:mx-auto 2xl:px-0">
        {children}
      </main>
      <Suspense fallback={null}>
        <ProductSheet />
      </Suspense>
      <Footer />
    </>
  );
}
