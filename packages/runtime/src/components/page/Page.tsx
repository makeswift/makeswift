'use client'

import { ReactElement, Children, createElement, useMemo, useEffect, useRef, useState } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import parse from 'html-react-parser'
import Head from 'next/head'

import { BodySnippet } from './BodySnippet'
import { DocumentReference } from '../../runtimes/react'
import { createDocumentReference } from '../../state/react-page'
import { useMakeswiftClient } from '../../api/react'
import { useIsInBuilder } from '../../react'
import deepEqual from '../../utils/deepEqual'
import { MakeswiftPageDocument } from '../../next'
import { Page as PageType, Site } from '../../api'

const SnippetLocation = {
  Body: 'BODY',
  Head: 'HEAD',
} as const

type SnippetLocation = typeof SnippetLocation[keyof typeof SnippetLocation]

type Snippet = {
  builderEnabled: boolean
  cleanup: string | null
  code: string
  id: string
  liveEnabled: boolean
  location: SnippetLocation
}

const defaultFavicon = {
  mimetype: 'image/png',
  publicUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAABcRAAAXEQHKJvM/AAABjElEQVRYhc2XzU3EMBCFB8TddAAXn6EE6GCpgNABZ1/IXnymBOgAOmA7YM8+ABVsXEHQQFaKQryeN3Yk3ilKJtEnv/nLUd/3pFG0riGi88yrnQn+UfJ5FUi0riWiB2H4nQn+KRd0DFP8agXEfkqCYJBoHdtxIQxfm+DfFgEhoith3NYE30o/qgGR2BJB+xY7kdYEL8oNFUi0jiFMJuxVWrJqEMFxsyUNCsE6AeNztvBp7aJ143vXksoRnwhYtmNdSoIQa6RlO9YXEWW7KgoCleOgxgTf1QZBT+RZ2lXFING6UxCCq+ceeUE8fYdknY599v9sJvzGBP+yCEgC7GPmETc0OJ+0awAlkhe2pAbIXAeFZ8xe2g2Nk3c3ub0xwWt6zY9qbmiqGVMbZK21ZC/YmhlbeBMTzZNDQqcvDb1kM1x32iqZSt1HaqukfKvq34BAOTLsrH+ETNmUkKHHA+428RgeclPVWozeSyAI2EdWB34jtqXNTAySOY3i/KgFIlqOa4GkFmBegorzg4joG07he/M7zl6jAAAAAElFTkSuQmCC',
}

// Taken from https://github.com/facebook/react/blob/14bac6193a334eda42e727336e8967419f08f5df/packages/react-dom/src/server/ReactPartialRenderer.js#L208
const VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_.\-\d]*$/

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
  return Children.map(parse(snippet.code), element => {
    if (typeof element === 'string') return element

    if (!VALID_TAG_REGEX.test(element.type)) return null

    const key = element.key ? `${snippet.id}:${element.key}` : snippet.id

    return createElement(element.type, { ...element.props, key })
  })
}

const filterUsedSnippetProperties = ({
  code,
  builderEnabled,
  liveEnabled,
  location,
  cleanup,
}: Snippet) => ({
  code,
  builderEnabled,
  liveEnabled,
  location,
  cleanup,
})

type Props = {
  document: MakeswiftPageDocument
}

export function Page({ document: page }: Props): JSX.Element {
  const isInBuilder = useIsInBuilder()
  const [snippets, setSnippets] = useState(page.snippets)
  // We're using cached results here for page snippets and site fonts so that anytime the user
  // changes the snippets or fonts on the builder, the change would be reflected here.
  // See this PR for discussions and things we can do to improve it in the future:
  // https://github.com/makeswift/makeswift/pull/77
  const cachedPage = useCachedPage(isInBuilder ? page.id : null)
  useEffect(() => {
    if (cachedPage == null) return

    const oldSnippets = snippets.map(filterUsedSnippetProperties)
    const newSnippets = cachedPage.snippets.map(filterUsedSnippetProperties)

    if (deepEqual(newSnippets, oldSnippets)) return

    setSnippets(cachedPage.snippets)
  }, [cachedPage])
  const site = useCachedSite(isInBuilder ? page.site.id : null)

  const baseLocalizedPage = page.localizedPages.find(({ parentId }) => parentId == null)
  const favicon = page.meta.favicon ?? defaultFavicon
  const title = baseLocalizedPage?.meta.title ?? page.meta.title
  const description = baseLocalizedPage?.meta.description ?? page.meta.description
  const keywords = baseLocalizedPage?.meta.keywords ?? page.meta.keywords
  const socialImage = baseLocalizedPage?.meta.socialImage ?? page.meta.socialImage
  const canonicalUrl = baseLocalizedPage?.seo.canonicalUrl ?? page.seo.canonicalUrl
  const isIndexingBlocked = baseLocalizedPage?.seo.isIndexingBlocked ?? page.seo.isIndexingBlocked
  const hreflangs = page.hreflangs

  const fontFamilyParamValue = useMemo(() => {
    if (site == null) {
      return page.fonts
        .map(({ family, variants }) => {
          return `${family.replace(/ /g, '+')}:${variants.join()}`
        })
        .join('|')
    }

    return site.googleFonts.edges
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
  }, [site, page])

  const filteredSnippets = useMemo(
    () => snippets.filter(snippet => (isInBuilder ? snippet.builderEnabled : snippet.liveEnabled)),
    [snippets, isInBuilder],
  )
  const headSnippets = useMemo(
    () => filteredSnippets.filter(snippet => snippet.location === SnippetLocation.Head),
    [filteredSnippets],
  )

  const previousHeadSnippets = useRef<MakeswiftPageDocument['snippets'] | null>(null)
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

  const documentId = baseLocalizedPage?.elementTreeId ?? page.id

  return (
    <>
      <Head>
        <style>
          {`
            html {
              font-family: sans-serif;
            }
            div#__next {
              overflow: hidden;
            }
          `}
        </style>

        <link rel="icon" type={favicon.mimetype} href={favicon.publicUrl} />

        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {isIndexingBlocked && <meta name="robots" content="noindex" />}

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
            <meta property="og:image:type" content={socialImage.mimetype} />
            <meta name="twitter:image" content={socialImage.publicUrl} />
            <meta name="twitter:card" content="summary_large_image" />
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

        {hreflangs.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
        ))}

        {headSnippets.map(snippetToElement).map(children =>
          Children.map(children, child => {
            if (typeof child === 'string') return child

            if (VALID_HEAD_ELEMENT_TYPES.includes(child.type as string)) return child

            return null
          }),
        )}
      </Head>

      <DocumentReference documentReference={createDocumentReference(documentId)} />

      {filteredSnippets
        .filter(snippet => snippet.location === SnippetLocation.Body)
        .map(snippet => (
          <BodySnippet key={snippet.id} code={snippet.code} cleanup={snippet.cleanup} />
        ))}
    </>
  )
}

function useCachedPage(pageId: string | null): PageType | null {
  const client = useMakeswiftClient()
  const getSnapshot = () => (pageId == null ? null : client.readPage(pageId))

  const page = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  return page
}

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  const site = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  return site
}
