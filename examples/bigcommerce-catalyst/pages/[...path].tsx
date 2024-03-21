// eslint-disable-next-line check-file/filename-naming-convention
import { Makeswift, Page as MakeswiftPage, MakeswiftPageSnapshot } from '@makeswift/runtime/next';
import { GetStaticPropsContext } from 'next';

import { Footer } from '~/components/footer/client';
import { PagesHeader } from '~/components/header/client';
import { getConfig } from '~/lib/makeswift/config';
import { runtime } from '~/lib/makeswift/runtime';
import '~/lib/makeswift/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { getInitialData } from '../client/queries/get-initial-data';
import { SessionProvider } from 'next-auth/react';
import { BcDataProvider } from '../providers/bc-data-provider';

type Props = {
  snapshot: MakeswiftPageSnapshot;
  bcData: Awaited<ReturnType<typeof getInitialData>>
};

export async function getStaticPaths() {
  const config = getConfig();
  const makeswift = new Makeswift(config.makeswift.siteApiKey);
  const pages = await makeswift.getPages();

  return {
    paths: pages.map((page) => ({
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
      },
    })),
    fallback: 'blocking',
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ path: string[] }>) {
  const config = getConfig();
  const makeswift = new Makeswift(config.makeswift.siteApiKey, { runtime });

  const path = `/${(ctx.params?.path ?? []).join('/')}`;
  
  const bcData = await getInitialData();
  const snapshot = await makeswift.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
  });
  
  if (snapshot == null) {
    return { notFound: true };
  }

  return {
    props: {
      snapshot,
      bcData
    },
  };
}

export default function Page({ snapshot, bcData }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }));

  return (
    <SessionProvider>
      <BcDataProvider value={bcData}>
        <QueryClientProvider client={queryClient}>
          <PagesHeader />
            <MakeswiftPage snapshot={snapshot} runtime={runtime} />
          <Footer />
        </QueryClientProvider>
      </BcDataProvider>
    </SessionProvider>
  );
}
