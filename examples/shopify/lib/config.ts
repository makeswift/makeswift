import invariant from 'tiny-invariant'

type PublicConfig = {
  shopify: {
    storeName: string
    accessToken: string
  }
}

type PrivateConfig = {
  makeswift: {
    siteApiKey: string
    productTemplatePathname: string
  }
}

export type Config = PublicConfig & PrivateConfig

export function getPublicConfig(): PublicConfig {
  invariant(
    process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
    'NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN env var is not defined.',
  )
  invariant(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME,
    'NEXT_PUBLIC_SHOPIFY_STORE_NAME env var is not defined.',
  )
  return {
    shopify: {
      accessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
      storeName: process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME,
    },
  }
}

export function getConfig(): Config {
  invariant(process.env.MAKESWIFT_SITE_API_KEY, 'MAKESWIFT_SITE_API_KEY env var is not defined.')
  return {
    ...getPublicConfig(),
    makeswift: {
      siteApiKey: process.env.MAKESWIFT_SITE_API_KEY,
      productTemplatePathname: '/__product__',
    },
  }
}
