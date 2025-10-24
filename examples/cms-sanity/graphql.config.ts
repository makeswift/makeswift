import type { LoadCodegenConfigResult } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

export const GRAPHQL_ENDPOINT = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/graphql/production/default`

const config: LoadCodegenConfigResult['config'] = {
  generates: {
    'generated/sanity.ts': {
      documents: './**/*.graphql',
      schema: {
        [`${GRAPHQL_ENDPOINT}`]: {
          headers: {
            Authorization: `Bearer ${process.env.SANITY_ACCESS_TOKEN}`,
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
