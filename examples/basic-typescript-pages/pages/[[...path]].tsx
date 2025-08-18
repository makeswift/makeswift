import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

import { Makeswift, Page as MakeswiftPage, PageProps as MakeswiftPageProps } from '@makeswift/runtime/next'

import { client } from '@/lib/makeswift/client'
import '@/lib/makeswift/components'

type PageProps = MakeswiftPageProps & { previewMode: boolean }

export const getStaticPaths = (async () => {
  return {
    paths: await client
      .getPages()
      .map(page => ({
        params: {
          path: page.path.split('/').filter(segment => segment !== ''),
        },
      }))
      .toArray(),
    fallback: 'blocking',
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async ({ params, previewData }) => {
  if (params == null) return { notFound: true }

  const path = Array.isArray(params.path) ? '/' + params.path.join('/') : '/'

  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(previewData),
  })

  if (snapshot == null) return { notFound: true }

  return { 
    props: { 
      snapshot, 
      previewMode: Makeswift.getPreviewMode(previewData)
    } 
  }
}) satisfies GetStaticProps<PageProps>

export default function Page({ snapshot }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <MakeswiftPage snapshot={snapshot} />
}
