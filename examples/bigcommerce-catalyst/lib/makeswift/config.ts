export interface Config {
  bigcommerce: {
    accessToken: string;
    storeURL: string;
    storefrontURL: string;
    storefrontToken: string;
    channelId: string;
    allowedCorsOrigins: string[];
  };
  makeswift: {
    siteApiKey: string;
    productTemplatePathname: string;
  };
}

function getEnvVarOrThrow(key: string): string {
  const value = process.env[key];

  if (!value) throw new Error(`"${key}" env var is not defined.`);

  return value;
}

export function getConfig(): Config {
  const storeHash = getEnvVarOrThrow('BIGCOMMERCE_STORE_HASH');
  const channelId = getEnvVarOrThrow('BIGCOMMERCE_CHANNEL_ID');

  return {
    bigcommerce: {
      accessToken: getEnvVarOrThrow('BIGCOMMERCE_ACCESS_TOKEN'),
      storeURL: `https://api.bigcommerce.com/stores/${storeHash}`,
      storefrontURL: `https://store-${storeHash}-${channelId}.mybigcommerce.com/graphql`,
      storefrontToken: getEnvVarOrThrow('BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN'),
      channelId,
      allowedCorsOrigins:
        process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
          ? [new URL(`https://${getEnvVarOrThrow('VERCEL_URL')}`).origin]
          : [],
    },
    makeswift: {
      siteApiKey: getEnvVarOrThrow('MAKESWIFT_SITE_API_KEY'),
      productTemplatePathname: '/__product__',
    },
  };
}
