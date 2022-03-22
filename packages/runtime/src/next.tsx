import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import NextDocument, { DocumentContext, DocumentInitialProps } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import { RuntimeProvider, Document as DocumentComponent, ReactRuntime } from './runtimes/react'
import { Element } from './state/react-page'

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

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
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
  pageId: string
  rootElement: Element
  makeswiftApiEndpoint: string
  registerComponents?(runtime: ReactRuntime): () => void
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

  const page = await res.json()

  if (page == null) return { notFound: true }

  return {
    props: {
      pageId: page.id,
      rootElement: page.data,
      makeswiftApiEndpoint: `${process['env'].MAKESWIFT_API_HOST}/graphql`,
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

  const page = await res.json()

  if (page == null) return { notFound: true, revalidate: REVALIDATE_SECONDS }

  return {
    props: {
      pageId: page.id,
      rootElement: page.data,
      makeswiftApiEndpoint: `${process['env'].MAKESWIFT_API_HOST}/graphql`,
    },
    revalidate: REVALIDATE_SECONDS,
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return { paths: [], fallback: 'blocking' }
}

export function Page({ pageId, rootElement, makeswiftApiEndpoint, registerComponents }: PageProps) {
  return (
    <RuntimeProvider
      defaultRootElements={new Map([[pageId, rootElement]])}
      makeswiftApiEndpoint={makeswiftApiEndpoint}
      registerComponents={registerComponents}
    >
      <DocumentComponent documentKey={pageId} />
    </RuntimeProvider>
  )
}
