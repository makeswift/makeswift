import { memo, useMemo } from 'react'

import { RuntimeProvider, ReactRuntime } from '../runtimes/react'
import { Page as PageMeta } from '../components/page'
import { MakeswiftClient } from '../api/react'
import { MakeswiftPageSnapshot } from './client'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
  runtime?: ReactRuntime
}
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Makeswift } from './client'
import { MakeswiftPreviewData } from './preview-mode'

function getApiOrigin(): string {
  const apiOriginString = process['env'].MAKESWIFT_API_HOST ?? 'https://api.makeswift.com'

  try {
    const url = new URL(apiOriginString)

    return url.origin
  } catch (error) {
    const errorMessage =
      '"MAKESWIFT_API_HOST" environment variable must be a valid URL. ' +
      `Expected something like "https://api.makeswift.com" but instead received "${apiOriginString}".`

    throw new Error(errorMessage)
  }
}

const uuidRegExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

function getApiKey(): string {
  const apiKey = process['env'].MAKESWIFT_SITE_API_KEY

  if (apiKey == null) {
    const errorMessage =
      '"MAKESWIFT_SITE_API_KEY" environment variable must be set. ' +
      'Please add your site API key to your `.env.local` file. ' +
      'More info: https://www.makeswift.com/docs/guides/manual-setup#add-environment-variables'

    throw new Error(errorMessage)
  }

  if (!uuidRegExp.test(apiKey)) {
    const errorMEssage =
      `Invalid Makeswift site API key "${apiKey}". ` +
      'Please check your `.env.local` file for the "MAKESWIFT_SITE_API_KEY" environment variable. ' +
      'More info: https://www.makeswift.com/docs/guides/manual-setup#add-environment-variables'

    throw new Error(errorMEssage)
  }

  return apiKey
}

type ParsedUrlQuery = { path?: string[] }

function deprecationWarning(methodName: string): void {
  const warningMessage =
    `The \`${methodName}\` export has been deprecated and will be removed in the next minor version. ` +
    'More info: https://github.com/makeswift/makeswift/releases/tag/%40makeswift%2Fruntime%400.2.0'

  if (process.env['NODE_ENV'] !== 'production') console.warn(warningMessage)
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<ParsedUrlQuery>> {
  deprecationWarning('getStaticPaths')

  const makeswift = new Makeswift(getApiKey(), { apiOrigin: getApiOrigin() })
  const pages = await makeswift.getPages()

  return {
    paths: pages.map(page => ({
      params: { path: page.path.split('/').filter(segment => segment !== '') },
    })),
    fallback: 'blocking',
  }
}

const REVALIDATE_SECONDS = 1

export async function getStaticProps(
  ctx: GetStaticPropsContext<ParsedUrlQuery, MakeswiftPreviewData>,
): Promise<GetStaticPropsResult<PageProps>> {
  deprecationWarning('getStaticProps')

  const makeswift = new Makeswift(getApiKey(), {
    apiOrigin: getApiOrigin(),
    unstable_previewData: ctx.previewData,
  })
  const path = '/' + (ctx.params?.path ?? []).join('/')
  const snapshot = await makeswift.getPageSnapshot(path, {
    preview: ctx.previewData?.makeswift === true,
  })

  if (snapshot == null) return { notFound: true, revalidate: REVALIDATE_SECONDS }

  return { props: { snapshot }, revalidate: REVALIDATE_SECONDS }
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ path?: string[] }>,
): Promise<GetServerSidePropsResult<PageProps>> {
  deprecationWarning('getServerSideProps')

  const makeswift = new Makeswift(getApiKey(), {
    apiOrigin: getApiOrigin(),
    unstable_previewData: ctx.previewData,
  })
  const path = '/' + (ctx.params?.path ?? []).join('/')
  const snapshot = await makeswift.getPageSnapshot(path, { preview: true })

  if (snapshot == null) return { notFound: true }

  return { props: { snapshot } }
}

export const Page = memo(({ snapshot, runtime }: PageProps) => {
  const client = useMemo(
    () =>
      new MakeswiftClient({
        uri: new URL('graphql', snapshot.apiOrigin).href,
        cacheData: snapshot.cacheData,
        localizedResourcesMap: snapshot.localizedResourcesMap,
        locale: snapshot.locale ? new Intl.Locale(snapshot.locale) : undefined,
      }),
    [snapshot],
  )
  const rootElements = new Map([[snapshot.document.id, snapshot.document.data]])

  snapshot.document.localizedPages.forEach(localizedPage => {
    rootElements.set(localizedPage.elementTreeId, localizedPage.data)
  })

  const translations = {
    '2d235c2b-fe09-4872-962c-adc42e49c7e8::text': {
      source: 'hello world',
      target: 'hola mundo',
    },
    '141b396b-5790-4c22-9fe9-e0c3f0baa0ee::text': {
      source: [
        { value: 'hello', id: 'f2d36e9e-74a7-4a0d-a15c-fc402b36e85b' },
        { value: 'world', id: 'cedbe3dd-cc1d-4fc1-b614-353c4d480d42' },
      ],
      target: [
        { value: 'hola', id: 'f2d36e9e-74a7-4a0d-a15c-fc402b36e85b' },
        { value: 'mundo', id: 'cedbe3dd-cc1d-4fc1-b614-353c4d480d42' },
      ],
    },
  }

  return (
    <RuntimeProvider
      client={client}
      rootElements={rootElements}
      preview={snapshot.preview}
      runtime={runtime}
      translations={translations}
    >
      {/* We use a key here to reset the Snippets state in the PageMeta component */}
      <PageMeta key={snapshot.document.data.key} document={snapshot.document} />
    </RuntimeProvider>
  )
})

export type { MakeswiftPage, MakeswiftPageDocument, MakeswiftPageSnapshot } from './client'
export { Makeswift } from './client'
export type { MakeswiftPreviewData } from './preview-mode'
export { PreviewModeScript } from './preview-mode'
export { Document } from './document'
export type { Manifest, Font, MakeswiftApiHandlerResponse } from './api-handler'
export { MakeswiftApiHandler } from './api-handler'
export { forwardNextDynamicRef } from './dynamic'
