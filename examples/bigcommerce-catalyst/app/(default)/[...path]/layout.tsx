import { getSiteVersion } from '@makeswift/runtime/next/server';

import { getInitialData } from '~/client/queries/get-initial-data';
import { Providers } from './providers';
import { PropsWithChildren } from 'react';

export default async function MakeswiftLayout({ children }: PropsWithChildren) {
  const bcData = await getInitialData();
  const siteVersion = await getSiteVersion();

  return (
    <Providers bcData={bcData} siteVersion={siteVersion}>{children}</Providers>
  )
}
