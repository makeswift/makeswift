import type { CodegenConfig } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'
import * as prismic from '@prismicio/client'
import assert from 'assert'

loadEnvConfig(process.cwd())

async function getConfig() {
  assert(process.env.PRISMIC_REPOSITORY_NAME, 'PRISMIC_REPOSITORY_NAME is required')
  assert(process.env.PRISMIC_ACCESS_TOKEN, 'PRISMIC_ACCESS_TOKEN is required')

  const client = prismic.createClient(process.env.PRISMIC_REPOSITORY_NAME, { fetch })

  const ref = (await client.getMasterRef()).ref

  const config: CodegenConfig = {
    generates: {
      'generated/prismic.ts': {
        documents: './**/*.graphql',
        schema: {
          [`https://${process.env.PRISMIC_REPOSITORY_NAME}.prismic.io/graphql`]: {
            headers: {
              'Prismic-Ref': ref,
              Authorization: `${process.env.PRISMIC_ACCESS_TOKEN}`,
            },
            method: 'GET',
          },
        },
        plugins: ['typescript', 'typed-document-node', 'typescript-operations'],
        config: {
          strictScalars: false,
        },
      },
    },
  }
  return config
}

export default getConfig()
