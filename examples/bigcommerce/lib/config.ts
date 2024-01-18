export type Config = {
  bigcommerce: {
    storeToken: string
    storeURL: string
    storefrontURL: string
    storefrontToken: string
    channelId: string
    allowedCorsOrigins: string[]
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
      storeToken: getEnvVarOrThrow('BIGCOMMERCE_STORE_API_TOKEN'),
      storeURL: getEnvVarOrThrow('BIGCOMMERCE_STORE_API_URL'),
      storefrontURL: getEnvVarOrThrow('BIGCOMMERCE_STOREFRONT_API_URL'),
      storefrontToken: getEnvVarOrThrow('BIGCOMMERCE_STOREFRONT_API_TOKEN'),
      channelId: getEnvVarOrThrow('BIGCOMMERCE_CHANNEL_ID'),
      allowedCorsOrigins:
        process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
          ? [new URL(`https://${getEnvVarOrThrow('VERCEL_URL')}`).origin]
          : [],
    },
    makeswift: {
      siteApiKey: getEnvVarOrThrow('MAKESWIFT_SITE_API_KEY'),
      productTemplatePathname: '/__product__',
    },
  }
}
