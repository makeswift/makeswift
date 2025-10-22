import { FetchableValue, ResourceResolver } from '@makeswift/controls'
import { type SiteVersion } from '../../../api/site-version'
import { ReactRuntimeCore } from '../../../runtimes/react/react-runtime-core'
import { Document, getElementId } from '../../../state/react-page'
import { MakeswiftClient } from '../../../client'

function createFetchable<T>(
  name: string,
  fetcher: () => Promise<T | null>,
): FetchableValue<T | null> {
  let lastValue: T | null = null

  return {
    name,
    subscribe: () => () => {},
    readStable: () => lastValue,
    fetch: async () => {
      const res = await fetcher()
      lastValue = res
      return res
    },
  }
}

export function serverResourceResolver(
  runtime: ReactRuntimeCore,
  client: MakeswiftClient,
  siteVersion: SiteVersion | null,
  { key: documentKey, locale }: Document,
): ResourceResolver {
  const serverResourceResolver: ResourceResolver = {
    resolveSwatch(swatchId: string | undefined) {
      return createFetchable(`swatch:${swatchId}`, async () => {
        if (!swatchId) return null
        return client.getSwatch(swatchId, siteVersion)
      })
    },

    resolveFile(fileId: string | undefined) {
      return createFetchable(`file:${fileId}`, async () => {
        if (!fileId) return null
        return client.getFile(fileId)
      })
    },

    resolveTypography(typographyId: string | undefined) {
      return createFetchable(`typography:${typographyId}`, async () => {
        if (!typographyId) return null
        return client.getTypography(typographyId, siteVersion)
      })
    },

    resolvePagePathnameSlice(pageId: string | undefined) {
      return createFetchable(`pagePathnameSlice:${pageId}`, async () => {
        if (!pageId) return null
        return client.getPagePathnameSlice(pageId, siteVersion, {
          locale: locale ?? undefined,
        })
      })
    },

    resolveElementId(elementKey: string) {
      return {
        name: `elementId:${documentKey}:${elementKey}`,
        subscribe: () => () => {},
        readStable: () => getElementId(runtime.store.getState(), documentKey, elementKey),
        fetch: async () => null,
      }
    },
  }

  return serverResourceResolver
}
