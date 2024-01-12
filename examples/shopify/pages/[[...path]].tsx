import '../lib/makeswift/register-components'

import {
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
  Makeswift,
} from '@makeswift/runtime/next'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { getProducts } from 'lib/shopify'
import { PageProps } from 'lib/types'
import { ProductsContext } from 'lib/products-context'
import { getConfig } from 'lib/config'

type Props = MakeswiftPageProps & PageProps

export async function getStaticPaths() {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswift.siteApiKey)
  const pages = await makeswift.getPages()

  return {
    paths: pages.map(page => ({
      params: {
        path: page.path.split('/').filter(segment => segment !== ''),
      },
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ path: string[] }>,
): Promise<GetStaticPropsResult<Props>> {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswift.siteApiKey)
  const path = '/' + (ctx.params?.path ?? []).join('/')

  const snapshot = await makeswift.getPageSnapshot(path, {
    siteVersion: Makeswift.getSiteVersion(ctx.previewData),
  })

  if (snapshot == null) return { notFound: true }

  const products = await getProducts()

  return {
    props: { snapshot, products },
  }
}

export default function Page({ products, snapshot }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <MakeswiftPage snapshot={snapshot} />
    </ProductsContext.Provider>
  )
}
