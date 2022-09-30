import '../lib/makeswift/register-components'

import {
  Makeswift,
  Page as MakeswiftPage,
  PageProps,
} from '@makeswift/runtime/next'
import { getConfig } from 'lib/config'
import { GetStaticPropsContext } from 'next'

export async function getStaticPaths() {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswiftSiteApiKey)
  const pages = await makeswift.getPages()

  return {
    paths: pages.map((page) => ({
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ path: string[] }>,
) {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswiftSiteApiKey)
  const path = '/' + (ctx.params?.path ?? []).join('/')
  const snapshot = await makeswift.getPageSnapshot(path, {
    preview: ctx.preview,
  })

  if (snapshot == null) return { notFound: true }

  return { props: { snapshot } }
}

export default function Page({ snapshot }: PageProps) {
  return <MakeswiftPage snapshot={snapshot} />
}
