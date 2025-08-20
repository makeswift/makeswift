import type { LoadCodegenConfigResult } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

export const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_PAYLOAD_SERVER_DOMAIN}/api/graphql`

const config: LoadCodegenConfigResult['config'] = {
  generates: {
    'generated/payload.ts': {
      documents: './**/*.graphql',
      schema: {
        [`${GRAPHQL_ENDPOINT}`]: {
          headers: {
            Authorization: `${process.env.PAYLOAD_USER_SLUG} API-Key ${process.env.PAYLOAD_ACCESS_TOKEN}`,
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
