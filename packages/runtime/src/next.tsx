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
  page: PageData
  rootElement: Element
  makeswiftApiEndpoint: string
  cacheData: NormalizedCacheObject
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
    },
    revalidate: REVALIDATE_SECONDS,
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return { paths: [], fallback: 'blocking' }
}

export function Page({ page, rootElement, makeswiftApiEndpoint, cacheData }: PageProps) {
  const [client] = useState(() => new MakeswiftClient({ uri: makeswiftApiEndpoint, cacheData }))

  useEffect(() => {
    client.updateCacheData(cacheData)
  }, [client, cacheData])

  return (
    <RuntimeProvider client={client} rootElements={new Map([[page.id, rootElement]])}>
      <PageMeta page={page} />
    </RuntimeProvider>
  )
}

export async function robotsTxtGetServerSideProps({
  req,
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Record<string, never>>> {
  const baseUrl = new URL(`https://${req.headers.host}`)

  res.setHeader('Content-Type', 'text/plain')

  const sitemapUrl = new URL(`sitemap.xml`, baseUrl)

  res.write(
    `User-agent: *
Allow: /
Sitemap: ${sitemapUrl}`,
  )

  res.end()

  return {
    props: {},
  }
}

export function RobotsTxt(): null {
  return null
}

const DEFAULT_PRIORITY = 0.75
const DEFAULT_FREQUENCY = 'hourly'

const mapToPriority = (potentialPriority: unknown) => {
  if (typeof potentialPriority != 'number') return DEFAULT_PRIORITY
  return Math.max(0, Math.min(potentialPriority, 1))
}

const validFrequency = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']

const mapToFrequency = (potentialFrequency: unknown) => {
  if (typeof potentialFrequency != 'string' || !validFrequency.includes(potentialFrequency))
    return DEFAULT_FREQUENCY
  return potentialFrequency
}

type SitemapAPIResult = {
  id: string
  isArchived: boolean
  pages: {
    id: string
    seo: {
      sitemapFrequency: number
      sitemapPriority: string
      isIndexingBlocked: boolean
    }
    publicUrl: string
    deployment: {
      createdAt: string
    }
  }[]
}

export async function sitemapXmlGetServerSideProps({
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Record<string, never>>> {
  const url = `${process['env'].MAKESWIFT_API_HOST}/v0/sitemap`

  const apiResponse = await fetch(url, {
    headers: { 'x-api-key': process['env'].MAKESWIFT_SITE_API_KEY! },
  })

  if (apiResponse.status !== 200) {
    console.error(await apiResponse.json())

    return { notFound: true }
  }

  const site: SitemapAPIResult = await apiResponse.json()

  if (site == null || site?.isArchived) {
    return { notFound: true }
  }

  res.setHeader('Content-Type', 'text/xml')

  res.write(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${site.pages
  .filter(page => !!page.deployment?.createdAt)
  .filter(page => !page.seo.isIndexingBlocked)
  .map(page => {
    return `<url>
    <loc>${page.publicUrl}</loc>
    <lastmod>${new Date(page.deployment?.createdAt).toISOString()}</lastmod>
    <changefreq>${mapToFrequency(page.seo.sitemapFrequency)}</changefreq>
    <priority>${mapToPriority(page.seo.sitemapPriority)}</priority>
</url>
    `
  })
  .join('')}
</urlset>
    `,
  )

  res.end()

  return {
    props: {},
  }
}

export function SitemapXml(): null {
  return null
}
