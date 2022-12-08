import '../lib/makeswift/register-components'

import {
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
  Makeswift,
} from '@makeswift/runtime/next'
import { GetStaticPathsContext, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { getProducts } from 'lib/bigcommerce'
import { PageProps } from 'lib/types'
import { ProductsContext } from 'lib/products-context'
import { getConfig } from 'lib/config'
import { DEFAULT_LOCALE, Locale } from 'lib/locale'

type Props = MakeswiftPageProps & PageProps

export async function getStaticPaths(ctx: GetStaticPathsContext) {
  const config = getConfig()
  const makeswift = new Makeswift(config.makeswift.siteApiKey)
  const pages = await makeswift.getPages()
  const pagesWithLocale = pages.flatMap(page => {
    if (ctx.locales == null) return { page, locale: ctx.defaultLocale }

    return ctx.locales.map(locale => ({ page, locale }))
  })

  return {
    paths: pagesWithLocale.map(({ page, locale }) => ({
      params: {
        path: page.path.split('/').filter(segment => segment !== ''),
      },
      locale,
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
    preview: ctx.preview,
  })

  if (snapshot == null) return { notFound: true }

  const products = await getProducts()

  return {
    props: {
      ...(await serverSideTranslations(
        ctx.locale ?? DEFAULT_LOCALE,
        ['common', 'cart', 'product'],
        null,
        [Locale.English, Locale.Spanish],
      )),
      snapshot,
      products,
    },
    revalidate: 1,
  }
}

export default function Page({ products, snapshot }: Props) {
  return (
    <ProductsContext.Provider value={products}>
      <MakeswiftPage snapshot={snapshot} />
    </ProductsContext.Provider>
  )
}
