import type { LoadCodegenConfigResult } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const config: LoadCodegenConfigResult['config'] = {
  generates: {
    'generated/contentful.ts': {
      documents: './**/*.graphql',
      schema: {
        [`${`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`}`]:
          {
            headers: {
              Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
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
