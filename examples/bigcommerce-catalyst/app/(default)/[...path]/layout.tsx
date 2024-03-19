import { getInitialData } from '~/client/queries/get-initial-data';
import { Providers } from './providers';
import { PropsWithChildren } from 'react';

export default async function MakeswiftLayout({ children }: PropsWithChildren) {
  const bcData = await getInitialData();

  return (
    <Providers bcData={bcData}>{children}</Providers>
  )
}
