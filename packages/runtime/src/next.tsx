import { NormalizedCacheObject } from '@apollo/client'
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import NextDocument, { DocumentContext, DocumentInitialProps } from 'next/document'
import { useEffect, useState } from 'react'
import { ServerStyleSheet } from 'styled-components'
import { KeyUtils } from 'slate'
import createEmotionServer from '@emotion/server/create-instance'
import { cache } from '@emotion/css'

import { MakeswiftClient } from './api/react'
import { Element } from './state/react-page'
import { RuntimeProvider } from './runtimes/react'
import { Page as PageMeta, PageData } from './components'

export { MakeswiftClient }

export class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await NextDocument.getInitialProps(ctx)

      KeyUtils.resetGenerator()

      const { extractCritical } = createEmotionServer(cache)
      const { ids, css } = extractCritical(initialProps.html)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <style
              data-emotion={`css ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}

const REVALIDATE_SECONDS = 1

export type PageProps = {
  page: PageData
  rootElement: Element
  makeswiftApiEndpoint: string
  cacheData: NormalizedCacheObject
  preview: boolean
}

type APIResult = PageData & {
  data: any
}

export async function getServerSideProps({
  query: { pageId },
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<PageProps>> {
  const url = `${process['env'].MAKESWIFT_API_HOST}/v0/preview-page-data?id=${pageId}`
  const res = await fetch(url, {
    headers: { 'x-api-key': process['env'].MAKESWIFT_SITE_API_KEY! },
  })

  if (res.status !== 200) {
    console.error(await res.json())

    return { notFound: true }
  }

  const page: APIResult = await res.json()

  if (page == null) return { notFound: true }

  const makeswiftApiEndpoint = `${process['env'].MAKESWIFT_API_HOST}/graphql`
  const client = new MakeswiftClient({ uri: makeswiftApiEndpoint })
  const cacheData = await client.prefetch(page.data)

  return {
    props: {
      page,
      rootElement: page.data,
      makeswiftApiEndpoint,
      cacheData,
      preview: true,
    },
  }
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ path: string[] }>): Promise<GetStaticPropsResult<PageProps>> {
  if (params == null) return { notFound: true, revalidate: REVALIDATE_SECONDS }
  const { path = [] } = params
  const url = `${process['env'].MAKESWIFT_API_HOST}/v0/live-page-data?path=${path.join('/')}`

  const res = await fetch(url, {
    headers: { 'x-api-key': process['env'].MAKESWIFT_SITE_API_KEY! },
  })

  if (res.status !== 200) {
    console.error(await res.json())

    return { notFound: true, revalidate: REVALIDATE_SECONDS }
  }

  const page: APIResult = await res.json()

  if (page == null) return { notFound: true, revalidate: REVALIDATE_SECONDS }

  const makeswiftApiEndpoint = `${process['env'].MAKESWIFT_API_HOST}/graphql`
  const client = new MakeswiftClient({ uri: makeswiftApiEndpoint })
  const cacheData = await client.prefetch(page.data)

  return {
    props: {
      page,
      rootElement: page.data,
      makeswiftApiEndpoint,
      cacheData,
      preview: false,
    },
    revalidate: REVALIDATE_SECONDS,
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return { paths: [], fallback: 'blocking' }
}

export function Page({ page, rootElement, makeswiftApiEndpoint, cacheData, preview }: PageProps) {
  const [client] = useState(() => new MakeswiftClient({ uri: makeswiftApiEndpoint, cacheData }))

  useEffect(() => {
    client.updateCacheData(cacheData)
  }, [client, cacheData])

  return (
    <RuntimeProvider client={client} rootElements={new Map([[page.id, rootElement]])}>
      <PageMeta page={page} preview={preview} />
    </RuntimeProvider>
  )
}
