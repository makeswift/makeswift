import 'lib/makeswift/register-components'

import {
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
  Makeswift,
} from '@makeswift/runtime/next'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { getProduct, getProducts } from 'lib/bigcommerce'
import { getConfig } from 'lib/config'
import { ProductPageProps } from 'lib/types'
import { ProductsContext } from 'lib/products-context'
import { ProductContext } from 'lib/product-context'
import { DEFAULT_LOCALE } from 'lib/locale'

type Props = MakeswiftPageProps & ProductPageProps

export async function getStaticPaths(ctx: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const products = await getProducts()

  const productsWithLocale = products.flatMap(product => {
    if (ctx.locales == null) return { product, locale: ctx.defaultLocale }

    return ctx.locales.map(locale => ({ product, locale }))
  })

  return {
    paths: productsWithLocale.map(({ product, locale }) => ({
      params: { slug: product.entityId.toString() },
      locale,
    })),
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswift.siteApiKey)

  const snapshot = await makeswift.getPageSnapshot(config.makeswift.productTemplatePathname, {
    preview: ctx.preview,
  })

  if (snapshot == null) return { notFound: true, revalidate: 1 }

  const slug = ctx.params?.slug

  if (slug == null) throw new Error('"slug" URL parameter must be defined.')

  const products = await getProducts()
  const product = await getProduct(Number.parseInt(slug.toString(), 10))

  if (product == null) return { notFound: true, revalidate: 1 }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? DEFAULT_LOCALE, [
        'common',
        'cart',
        'product',
      ])),
      snapshot,
      products,
      product,
    },
    revalidate: 1,
  }
}

export default function Page({ products, product, snapshot }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <ProductContext.Provider value={product}>
        <MakeswiftPage snapshot={snapshot} />
      </ProductContext.Provider>
    </ProductsContext.Provider>
  )
}
