import '../lib/makeswift/register-components'

import {
  getServerSideProps as makeswiftGetServerSideProps,
  PageProps as MakeswiftPageProps,
} from '@makeswift/runtime/next'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { PageProps } from 'lib/types'
import { getProducts, DEFAULT_PRODUCT } from 'lib/shopify'

type Props = MakeswiftPageProps & PageProps

export async function getServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const makeswiftResult = await makeswiftGetServerSideProps(ctx)

  if (!('props' in makeswiftResult)) return makeswiftResult

  const products = await getProducts()
  const product = DEFAULT_PRODUCT

  return {
    ...makeswiftResult,
    // @ts-ignore: `GetServerSidePropsResult['props']` is wrapped in a promise for some reason.
    props: { ...makeswiftResult.props, products, product },
  }
}

export { Page as default } from '@makeswift/runtime/next'
