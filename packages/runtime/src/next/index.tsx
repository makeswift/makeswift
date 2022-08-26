import { NormalizedCacheObject } from '@apollo/client'
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'

import NextDocument, { DocumentContext, DocumentInitialProps } from 'next/document'
import {
  ComponentType,
  ForwardRefExoticComponent,
  ForwardedRef,
  PropsWithoutRef,
  RefAttributes,
  createElement,
  forwardRef,
  useEffect,
  useState,
} from 'react'
import { ServerStyleSheet } from 'styled-components'
import { KeyUtils } from 'slate'
import createEmotionServer from '@emotion/server/create-instance'
import { cache } from '@emotion/css'

import { MakeswiftClient } from '../api/react'
import { Element } from '../state/react-page'
import { RuntimeProvider } from '../runtimes/react'
import { Page as PageMeta, PageData } from '../components/page'

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

export async function getServerSideProps({
  query: { pageId },
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<PageProps>> {
  const url = `${getApiOrigin()}/v0/preview-page-data?id=${pageId}`
  const res = await fetch(url, { headers: { 'x-api-key': getApiKey() } })

  if (res.status === 404) {
    console.error(await res.json())

    return { notFound: true }
  }

  if (!res.ok) {
    const json = await res.json()

    throw new Error(json.message)
  }

  const page: APIResult = await res.json()

  if (page == null) return { notFound: true }

  const makeswiftApiEndpoint = `${getApiOrigin()}/graphql`
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
  const url = `${getApiOrigin()}/v0/live-page-data?path=${path.join('/')}`

  const res = await fetch(url, { headers: { 'x-api-key': getApiKey() } })

  if (res.status === 404) {
    console.error(await res.json())

    return { notFound: true, revalidate: REVALIDATE_SECONDS }
  }

  if (!res.ok) {
    const json = await res.json()

    throw new Error(json.message)
  }

  const page: APIResult = await res.json()

  if (page == null) return { notFound: true, revalidate: REVALIDATE_SECONDS }

  const makeswiftApiEndpoint = `${getApiOrigin()}/graphql`
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

const FORWARDED_NEXT_DYNAMIC_REF_KEY = '__forwarded_next_dynamic_ref__'

type WithSavedForwardedRef<P, T> = P & {
  [FORWARDED_NEXT_DYNAMIC_REF_KEY]: ForwardedRef<T>
}

function saveForwardedRef<P, T>(props: P, ref: ForwardedRef<T>): WithSavedForwardedRef<P, T> {
  return { ...props, [FORWARDED_NEXT_DYNAMIC_REF_KEY]: ref }
}

type WithLoadedForwardedRef<P, T> = Omit<P, typeof FORWARDED_NEXT_DYNAMIC_REF_KEY> & {
  ref: ForwardedRef<T>
}

function loadForwardedRef<P, T>({
  [FORWARDED_NEXT_DYNAMIC_REF_KEY]: ref,
  ...props
}: WithSavedForwardedRef<P, T>): WithLoadedForwardedRef<P, T> {
  return { ...props, ref }
}

type LoaderComponent<P> = Promise<ComponentType<P> | { default: ComponentType<P> }>

function resolve(obj: any) {
  return obj && obj.__esModule ? obj.default : obj
}

type PatchedLoaderComponent<P, T> = LoaderComponent<WithSavedForwardedRef<P, T>>

type PatchLoaderComponent = <P, T>(
  loaderComponent: LoaderComponent<P>,
) => PatchedLoaderComponent<P, T>

export function forwardNextDynamicRef<T, P>(
  nextDynamicThunk: (patch: PatchLoaderComponent) => ComponentType<WithSavedForwardedRef<P, T>>,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const Dynamic = nextDynamicThunk(loaderComponent =>
    loaderComponent.then(moduleOrComponent => ({
      __esModule: true,
      default: props => createElement(resolve(moduleOrComponent), loadForwardedRef(props)),
    })),
  )

  return forwardRef<T, P>((props, ref) => <Dynamic {...saveForwardedRef(props, ref)} />)
}
