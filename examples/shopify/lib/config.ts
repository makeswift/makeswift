export type Config = {
  shopify: {
    storeName: string
    accessToken: string
  }
  makeswift: {
    siteApiKey: string
    productTemplatePathname: string
  }
}

function getEnvVarOrThrow(key: string): string {
  const value = process.env[key]

  if (!value) throw new Error(`"${key}" env var is not defined.`)

  return value
}

export function getConfig(): Config {
  return {
    shopify: {
      accessToken: getEnvVarOrThrow('SHOPIFY_ACCESS_TOKEN'),
      storeName: getEnvVarOrThrow('SHOPIFY_STORE_NAME'),
    },
    makeswift: {
      siteApiKey: getEnvVarOrThrow('MAKESWIFT_SITE_API_KEY'),
      productTemplatePathname: '/__product__',
    },
  }
}
