import {
  ReactElement,
  Children,
  // createElement,
  useMemo,
  useEffect,
  useRef,
} from 'react'
// import parse from 'html-react-parser'
import Head from 'next/head'

import { BodySnippet } from './BodySnippet'
import { Document } from '../../react'

type Maybe<T> = T | null

type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: string
  DateTime: string
  Email: string
  JSON: Record<string, unknown>
  JWT: string
  Mimetype: string
  URL: string
  URLPathname: string
}

type Snippet = {
  __typename?: 'Snippet'
  builderEnabled: Scalars['Boolean']
  cleanup?: Maybe<Scalars['String']>
  code: Scalars['String']
  id: Scalars['ID']
  liveEnabled: Scalars['Boolean']
  location: SnippetLocation
  name: Scalars['String']
  shouldAddToNewPages: Scalars['Boolean']
}

enum SnippetLocation {
  Body = 'BODY',
  Head = 'HEAD',
}

type PageMetadataFragment = {
  __typename?: 'Page'
  id: string
  meta: {
    __typename?: 'PageMetadata'
    title?: string | null | undefined
    description?: string | null | undefined
    keywords?: string | null | undefined
    socialImage?:
      | { __typename?: 'File'; id: string; publicUrl: any; mimetype: any }
      | null
      | undefined
  }
  snippets: Array<{
    __typename?: 'Snippet'
    id: string
    code: string
    cleanup?: string | null | undefined
    location: SnippetLocation
    liveEnabled: boolean
    builderEnabled: boolean
  }>
  site: {
    __typename?: 'Site'
    id: string
    favicon?: { __typename?: 'File'; id: string; publicUrl: any; mimetype: any } | null | undefined
    fonts: {
      __typename?: 'SiteGoogleFontConnection'
      edges: Array<
        | {
            __typename?: 'SiteGoogleFontEdge'
            activeVariants: Array<{ __typename?: 'GoogleFontVariant'; specifier: string }>
            node: {
              __typename?: 'GoogleFont'
              family: string
              variants: Array<{ __typename?: 'GoogleFontVariant'; specifier: string }>
            }
          }
        | null
        | undefined
      >
    }
    globalElements: Array<{ __typename?: 'GlobalElement'; id: string; name: string; data: any }>
  }
}

const defaultFavicon = {
  mimetype: 'image/png',
  publicUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAABcRAAAXEQHKJvM/AAABjElEQVRYhc2XzU3EMBCFB8TddAAXn6EE6GCpgNABZ1/IXnymBOgAOmA7YM8+ABVsXEHQQFaKQryeN3Yk3ilKJtEnv/nLUd/3pFG0riGi88yrnQn+UfJ5FUi0riWiB2H4nQn+KRd0DFP8agXEfkqCYJBoHdtxIQxfm+DfFgEhoith3NYE30o/qgGR2BJB+xY7kdYEL8oNFUi0jiFMJuxVWrJqEMFxsyUNCsE6AeNztvBp7aJ143vXksoRnwhYtmNdSoIQa6RlO9YXEWW7KgoCleOgxgTf1QZBT+RZ2lXFING6UxCCq+ceeUE8fYdknY599v9sJvzGBP+yCEgC7GPmETc0OJ+0awAlkhe2pAbIXAeFZ8xe2g2Nk3c3ub0xwWt6zY9qbmiqGVMbZK21ZC/YmhlbeBMTzZNDQqcvDb1kM1x32iqZSt1HaqukfKvq34BAOTLsrH+ETNmUkKHHA+428RgeclPVWozeSyAI2EdWB34jtqXNTAySOY3i/KgFIlqOa4GkFmBegorzg4joG07he/M7zl6jAAAAAElFTkSuQmCC',
}

// Taken from https://github.com/facebook/react/blob/14bac6193a334eda42e727336e8967419f08f5df/packages/react-dom/src/server/ReactPartialRenderer.js#L208
// const VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_.\-\d]*$/

const VALID_HEAD_ELEMENT_TYPES = [
  'title',
  'base',
  'link',
  'style',
  'meta',
  'script',
  'noscript',
  'template',
]

function snippetToElement(snippet: Pick<Snippet, 'id' | 'code'>): (string | ReactElement)[] {
  return [snippet.code]

  // return Children.map(parse(snippet.code), element => {
  //   if (typeof element === 'string') return element

  //   if (!VALID_TAG_REGEX.test(element.type)) return null

  //   const key = element.key ? `${snippet.id}:${element.key}` : snippet.id

  //   return createElement(element.type, { ...element.props, key })
  // })
}

type Props = {
  page: PageMetadataFragment
  preview?: boolean
}

export function Page({ page, preview = false }: Props): JSX.Element {
  const favicon = page.site.favicon ?? defaultFavicon
  const { title, description, keywords, socialImage } = page.meta
  const fontFamilyParamValue = page.site.fonts.edges
    .filter((edge): edge is NonNullable<typeof edge> => edge != null)
    .map(({ activeVariants, node: { family, variants } }) => {
      const activeVariantSpecifiers = variants
        .filter(variant =>
          activeVariants.some(activeVariant => activeVariant.specifier === variant.specifier),
        )
        .map(variant => variant.specifier)
        .join()

      return `${family.replace(/ /g, '+')}:${activeVariantSpecifiers}`
    })
    .join('|')
  const snippets = useMemo(
    () => page.snippets.filter(snippet => (preview ? snippet.builderEnabled : snippet.liveEnabled)),
    [page, preview],
  )
  const headSnippets = useMemo(
    () => snippets.filter(snippet => snippet.location === SnippetLocation.Head),
    [snippets],
  )

  const previousHeadSnippets = useRef<PageMetadataFragment['snippets'] | null>(null)
  useEffect(() => {
    const headSnippetsToCleanUp = (previousHeadSnippets.current ?? [])
      .filter(previousSnippet => previousSnippet.cleanup != null)
      .filter(previousSnippet => !headSnippets.some(snippet => previousSnippet.id === snippet.id))

    headSnippetsToCleanUp.forEach(snippetToCleanUp => {
      if (snippetToCleanUp.cleanup == null) return

      const cleanUp = new Function(snippetToCleanUp.cleanup)

      try {
        cleanUp()
      } catch {
        // Ignore errors from user input.
      }
    })

    previousHeadSnippets.current = headSnippets
  }, [headSnippets])

  return (
    <>
      {/* <style global jsx>{`
        html {
          font-family: sans-serif;
        }
        div#__next {
          overflow: hidden;
        }
      `}</style> */}

      <Head>
        <link rel="icon" type={favicon.mimetype} href={favicon.publicUrl} />

        {title && (
          <>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="twitter:title" content={title} />
            <meta itemProp="name" content={title} />
          </>
        )}

        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="twitter:description" content={description} />
            <meta itemProp="description" content={description} />
          </>
        )}

        {keywords && <meta name="keywords" content={keywords} />}

        {socialImage && (
          <>
            <meta property="og:image" content={socialImage.publicUrl} />
            <meta property="og:image:type" content={socialImage.publicUrl} />
            <meta name="twitter:image" content={socialImage.publicUrl} />
            <meta name="twitter:card" content={socialImage.publicUrl} />
            <meta itemProp="image" content={socialImage.publicUrl} />
          </>
        )}

        {fontFamilyParamValue !== '' && (
          <>
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css?family=${fontFamilyParamValue}&display=swap`}
            />
          </>
        )}

        {headSnippets.map(snippetToElement).map(children =>
          Children.map(children, child => {
            if (typeof child === 'string') return child

            if (VALID_HEAD_ELEMENT_TYPES.includes(child.type as string)) return child

            return null
          }),
        )}
      </Head>

      <Document documentKey={page.id} />

      {snippets
        .filter(snippet => snippet.location === SnippetLocation.Body)
        .map(snippet => (
          <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
        ))}
    </>
  )
}
