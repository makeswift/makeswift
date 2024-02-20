'use client'

import { Children, createElement, ReactElement, useEffect, useMemo, useRef } from 'react'
import parse from 'html-react-parser'
import { MakeswiftPageDocument } from '../../next'
import { usePageSnippets, Snippet } from '../hooks/usePageSnippets'
import { useIsInBuilder } from '../../react'
import { useMakeswiftHostApiClient } from '../../next/context/makeswift-host-api-client'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { Site } from '../../api'
import { PageTitle, PageMeta, PageLink, PageStyle } from '../../next/components/head-tags'
import Head from 'next/head'

const defaultFavicon = {
  id: 'default-favicon',
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

type Props = {
  document: MakeswiftPageDocument
}

export function PageHead({ document: page }: Props): JSX.Element {
  const { headSnippets } = usePageSnippets({ page })

  const isInBuilder = useIsInBuilder()

  const site = useCachedSite(isInBuilder ? page.site.id : null)
  const baseLocalizedPage = page.localizedPages.find(({ parentId }) => parentId == null)

  const favicon = page.meta.favicon ?? defaultFavicon
  const title = baseLocalizedPage?.meta.title ?? page.meta.title
  const description = baseLocalizedPage?.meta.description ?? page.meta.description
  const keywords = baseLocalizedPage?.meta.keywords ?? page.meta.keywords
  const socialImage = baseLocalizedPage?.meta.socialImage ?? page.meta.socialImage
  const canonicalUrl = baseLocalizedPage?.seo.canonicalUrl ?? page.seo.canonicalUrl
  const isIndexingBlocked = baseLocalizedPage?.seo.isIndexingBlocked ?? page.seo.isIndexingBlocked

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

  // When the page snippets change, we run the cleanup function for any snippets
  // that are no longer present. This process only happens in the builder
  const previousHeadSnippets = useRef<MakeswiftPageDocument['snippets'] | null>(null)
  useEffect(() => {
    const headSnippetsToCleanUp = (previousHeadSnippets.current ?? [])
      .filter(previousSnippet => previousSnippet.cleanup != null)
      .filter(previousSnippet => !headSnippets.some(snippet => previousSnippet.id === snippet.id))

    headSnippetsToCleanUp.forEach(snippetToCleanUp => {
      if (snippetToCleanUp.cleanup == null) return

      try {
        const cleanUp = new Function(snippetToCleanUp.cleanup)
        cleanUp()
      } catch (err) {
        console.error('Error attempting to parse snippet cleanup', err)
        // Ignore errors from user input.
      }
    })

    previousHeadSnippets.current = headSnippets
  }, [headSnippets])

  return (
    <>
      <PageStyle precedence="high" href="makeswift-base-styles">
        {`
        html {
            font-family: sans-serif;
        }
        div#__next {
            overflow: hidden;
        }
        `}
      </PageStyle>
      {title && <PageTitle>{title}</PageTitle>}
      {favicon && <PageLink rel="icon" type={favicon.mimetype} href={favicon.publicUrl} />}
      {canonicalUrl && <PageLink rel="canonical" href={canonicalUrl} />}
      {isIndexingBlocked && <PageMeta name="robots" content="noindex" />}
      {description && (
        <>
          <PageMeta name="description" content={description} />
          <PageMeta property="og:description" content={description} />
          <PageMeta name="twitter:description" content={description} />
        </>
      )}
      {keywords && <PageMeta name="keywords" content={keywords} />}
      {socialImage && (
        <>
          <PageMeta property="og:image" content={socialImage.publicUrl} />
          <PageMeta property="og:image:type" content={socialImage.mimetype} />
          <PageMeta name="twitter:image" content={socialImage.publicUrl} />
          <PageMeta name="twitter:card" content="summary_large_image" />
        </>
      )}
      {fontFamilyParamValue !== '' && (
        <PageLink
          precedence="medium"
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css?family=${fontFamilyParamValue}&display=swap`}
        />
      )}
      <Head>
        {headSnippets.map(snippetToElement).map(children =>
          Children.map(children, child => {
            if (typeof child === 'string') return child
            if (VALID_HEAD_ELEMENT_TYPES.includes(child.type as string)) {
              return child
            }
            return null
          }),
        )}
      </Head>
    </>
  )
}

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  const site = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  return site
}
