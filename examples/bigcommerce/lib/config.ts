export type Config = {
  bigcommerce: {
    storeName: string
    storeHash: string
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
    bigcommerce: {
      accessToken: getEnvVarOrThrow('BIGCOMMERCE_ACCESS_TOKEN'),
      storeHash: getEnvVarOrThrow('BIGCOMMERCE_STORE_HASH'),
      storeName: getEnvVarOrThrow('BIGCOMMERCE_STORE_NAME'),
    },
    makeswift: {
      siteApiKey: getEnvVarOrThrow('MAKESWIFT_SITE_API_KEY'),
      productTemplatePathname: '/__product__',
    },
  }
}
