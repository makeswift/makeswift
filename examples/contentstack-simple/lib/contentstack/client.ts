import { env } from 'env'
import { GraphQLClient } from 'graphql-request'

const getContentstackGraphQLUrl = (region: string = 'US') => {
  const regionUrls = {
    US: 'https://graphql.contentstack.com',
    EU: 'https://eu-graphql.contentstack.com',
    AZURE_NA: 'https://azure-na-graphql.contentstack.com',
    AZURE_EU: 'https://azure-eu-graphql.contentstack.com',
    GCP_NA: 'https://gcp-na-graphql.contentstack.com',
  }
  
  return regionUrls[region as keyof typeof regionUrls] || regionUrls.US
}

export const client = new GraphQLClient(
  `${getContentstackGraphQLUrl(env.CONTENTSTACK_REGION)}/stacks/${env.CONTENTSTACK_API_KEY}?environment=${env.CONTENTSTACK_ENVIRONMENT}`,
  {
    errorPolicy: 'all',
    headers: {
      access_token: env.CONTENTSTACK_DELIVERY_TOKEN,
    },
  }
)