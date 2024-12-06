import type { LoadCodegenConfigResult } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const config: LoadCodegenConfigResult['config'] = {
  generates: {
    'generated/contentful.ts': {
      documents: './components/Contentful/**/*.graphql',
      schema: {
        [`${`https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`}`]:
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_API_TOKEN}`,
            },
          },
      },
      plugins: ['typescript', 'typed-document-node', 'typescript-operations'],
      config: {
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          Dimension: 'number',
          HexColor: 'string',
          JSON: '{ [key: string]: any }',
          Quality: 'number',
        },
      },
    },
  },
}
export default config
