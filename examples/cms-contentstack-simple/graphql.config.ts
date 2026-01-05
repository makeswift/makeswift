import type { LoadCodegenConfigResult } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

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

const config: LoadCodegenConfigResult['config'] = {
  generates: {
    'generated/contentstack.ts': {
      documents: './**/*.graphql',
      schema: {
        [`${getContentstackGraphQLUrl(process.env.CONTENTSTACK_REGION)}/stacks/${process.env.CONTENTSTACK_API_KEY}?environment=${process.env.CONTENTSTACK_ENVIRONMENT}`]:
          {
            headers: {
              access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
            },
          },
      },
      plugins: ['typescript', 'typed-document-node', 'typescript-operations'],
      config: {
        strictScalars: false,
      },
    },
  },
}

export default config