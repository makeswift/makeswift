import '../../lib/makeswift/register-components'

import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import {
  getStaticProps as makeswiftGetStaticProps,
  PageProps as MakeswiftPageProps,
  Page as MakeswiftPage,
} from '@makeswift/runtime/next'

import { getProductBySlug, getProductSlugPaths } from '../../lib/bigcommerce/utils'
import { ProductContext } from '../../lib/makeswift/context'

type Props = MakeswiftPageProps & {
  product: any
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths = await getProductSlugPaths()

  return { paths: paths.map(p => ({ params: { slug: p } })), fallback: true }
}

export async function getStaticProps(
  ctx: GetStaticPropsContext,
): Promise<GetStaticPropsResult<Props>> {
  // Map any version of this page to the __post__ url in Makeswift
  const makeswiftResult = await makeswiftGetStaticProps({
    ...ctx,
    params: { ...ctx.params, path: ['__product__'] },
  })
  const product = await getProductBySlug(ctx.params?.slug as string)
  if (!product) return { notFound: true }

  // @ts-ignore
  return {
    ...makeswiftResult,
    // @ts-ignore
    props: { ...makeswiftResult.props, product },
    revalidate: 300,
  }
}

export default function Page({ product, ...restOfProps }: Props) {
  if (!product) return

  return (
    <ProductContext.Provider value={product}>
      <MakeswiftPage {...restOfProps} />;
    </ProductContext.Provider>
  )
}
