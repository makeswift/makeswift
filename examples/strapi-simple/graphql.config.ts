import type { LoadCodegenConfigResult } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const config: LoadCodegenConfigResult['config'] = {
  generates: {
    'generated/strapi.ts': {
      documents: './**/*.graphql',
      schema: {
        [`${process.env.STRAPI_SERVER_DOMAIN}/graphql`]: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.STRAPI_ACCESS_TOKEN}`,
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
