'use client'

import { useMemo } from 'react'
import { MakeswiftPageDocument } from '../../next'
import { usePageSnippets } from '../hooks/usePageSnippets'
import { useIsInBuilder } from '../../react'
import { useMakeswiftHostApiClient } from '../../runtimes/react/host-api-client'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { Site } from '../../api'
import { PageTitle, PageMeta, PageLink, PageStyle } from '../../next/components/head-tags'
import { HeadSnippet } from './HeadSnippet'
import { type PageMetadataSettings } from './page-seo-settings'

const defaultFavicon = {
  id: 'default-favicon',
  mimetype: 'image/png',
  publicUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAABcRAAAXEQHKJvM/AAABjElEQVRYhc2XzU3EMBCFB8TddAAXn6EE6GCpgNABZ1/IXnymBOgAOmA7YM8+ABVsXEHQQFaKQryeN3Yk3ilKJtEnv/nLUd/3pFG0riGi88yrnQn+UfJ5FUi0riWiB2H4nQn+KRd0DFP8agXEfkqCYJBoHdtxIQxfm+DfFgEhoith3NYE30o/qgGR2BJB+xY7kdYEL8oNFUi0jiFMJuxVWrJqEMFxsyUNCsE6AeNztvBp7aJ143vXksoRnwhYtmNdSoIQa6RlO9YXEWW7KgoCleOgxgTf1QZBT+RZ2lXFING6UxCCq+ceeUE8fYdknY599v9sJvzGBP+yCEgC7GPmETc0OJ+0awAlkhe2pAbIXAeFZ8xe2g2Nk3c3ub0xwWt6zY9qbmiqGVMbZK21ZC/YmhlbeBMTzZNDQqcvDb1kM1x32iqZSt1HaqukfKvq34BAOTLsrH+ETNmUkKHHA+428RgeclPVWozeSyAI2EdWB34jtqXNTAySOY3i/KgFIlqOa4GkFmBegorzg4joG07he/M7zl6jAAAAAElFTkSuQmCC',
}

type Props = {
  document: MakeswiftPageDocument
  metadata?: PageMetadataSettings
}

export function PageHead({ document: page, metadata = {} }: Props): JSX.Element {
  const {
    title: useTitle = false,
    favicon: useFavicon = false,
    canonicalUrl: useCanonicalUrl = false,
    indexingBlocked: useIndexingBlocked = false,
    description: useDescription = false,
    keywords: useKeywords = false,
    socialImage: useSocialImage = false,
  } = metadata

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
      {useTitle && title && <PageTitle>{title}</PageTitle>}
      {useFavicon && favicon && (
        <PageLink rel="icon" type={favicon.mimetype} href={favicon.publicUrl} />
      )}
      {useCanonicalUrl && canonicalUrl && <PageLink rel="canonical" href={canonicalUrl} />}
      {useIndexingBlocked && isIndexingBlocked && <PageMeta name="robots" content="noindex" />}
      {useDescription && description && (
        <>
          <PageMeta name="description" content={description} />
          <PageMeta property="og:description" content={description} />
          <PageMeta name="twitter:description" content={description} />
        </>
      )}
      {useKeywords && keywords && <PageMeta name="keywords" content={keywords} />}
      {useSocialImage && socialImage && (
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
      {headSnippets.map(snippet => (
        <HeadSnippet key={snippet.id} snippet={snippet} />
      ))}
    </>
  )
}

function useCachedSite(siteId: string | null): Site | null {
  const client = useMakeswiftHostApiClient()
  const getSnapshot = () => (siteId == null ? null : client.readSite(siteId))

  const site = useSyncExternalStore(client.subscribe, getSnapshot, getSnapshot)

  return site
}
