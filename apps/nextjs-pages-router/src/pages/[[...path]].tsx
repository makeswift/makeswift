import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'

import {
  Page as MakeswiftPage,
  PageProps as MakeswiftPageProps,
  Makeswift,
  MakeswiftVersionData,
} from '@makeswift/runtime/next'

import { client } from '@/makeswift/client'
import '@/makeswift/components'

type ParsedUrlQuery = { path?: string[] }

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<ParsedUrlQuery>
> {
  const pages = await client.getPages().toArray()

  return {
    paths: pages.map((page) => ({
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
      },
    })),
    fallback: 'blocking',
  }
}

export type PageProps = MakeswiftPageProps & {
  siteVersion: MakeswiftVersionData | null
  locale: string | undefined
}

export async function getStaticProps({
  params,
  previewData,
  locale,
}: GetStaticPropsContext<ParsedUrlQuery>): Promise<
  GetStaticPropsResult<PageProps>
> {
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(previewData),
    locale,
  })

  if (snapshot == null) return { notFound: true }

  return {
    props: {
      snapshot,
      siteVersion: Makeswift.getSiteVersion(previewData),
      locale,
    },
  }
}

export default function Page({ snapshot }: MakeswiftPageProps) {
  return <MakeswiftPage snapshot={snapshot} />
}
