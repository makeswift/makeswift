/**
 * BigCommerce Storefront GraphQL client for server-side data fetching
 */

export interface StorefrontClientConfig {
  storeUrl: string
  storefrontApiToken: string
}

export class StorefrontClient {
  private config: StorefrontClientConfig

  constructor(config: StorefrontClientConfig) {
    this.config = config
  }

  async query(query: string, variables: Record<string, any> = {}): Promise<any> {
    const graphqlEndpoint = `${this.config.storeUrl}/graphql`
    
    try {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.storefrontApiToken}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors)
        throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`)
      }

      return result.data
    } catch (error) {
      console.error('Storefront API query failed:', error)
      throw error
    }
  }
}

/**
 * Create a storefront client from environment variables
 */
export function createStorefrontClient(): StorefrontClient | null {
  const storeUrl = process.env.BIGCOMMERCE_STORE_URL
  const storefrontApiToken = process.env.STOREFRONT_API_TOKEN

  if (!storeUrl || !storefrontApiToken) {
    console.warn('Missing required environment variables: BIGCOMMERCE_STORE_URL or STOREFRONT_API_TOKEN')
    return null
  }

  return new StorefrontClient({
    storeUrl,
    storefrontApiToken,
  })
}