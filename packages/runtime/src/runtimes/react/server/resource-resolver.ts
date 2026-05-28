import { FetchableValue, ResourceResolver } from '@makeswift/controls'

import { getElementId } from '../../../state/read-only-state'

import { type ServerRenderContext, getStore } from './render-context'

export function serverResourceResolver(context: ServerRenderContext): ResourceResolver {
  const {
    client,
    siteVersion,
    document: { locale, key: documentKey },
  } = context

  return {
    resolveSwatch: swatchId =>
      fetchableValue(`swatch:${swatchId}`, async () =>
        swatchId ? client.getSwatch(swatchId, siteVersion) : null,
      ),

    resolveFile: fileId =>
      fetchableValue(`file:${fileId}`, async () => (fileId ? client.getFile(fileId) : null)),

    resolveTypography: typographyId =>
      fetchableValue(`typography:${typographyId}`, async () =>
        typographyId ? client.getTypography(typographyId, siteVersion) : null,
      ),

    resolvePagePathnameSlice: pageId =>
      fetchableValue(`pagePathnameSlice:${pageId}`, async () =>
        pageId
          ? client.getPagePathnameSlice(pageId, siteVersion, {
              locale: locale ?? undefined,
            })
          : null,
      ),

    resolveElementId: elementKey => ({
      name: `elementId:${documentKey}:${elementKey}`,
      readStable: () => getElementId(getStore(context).getState(), documentKey, elementKey),
      subscribe: () => () => {},
    }),
  }
}

function fetchableValue<T>(
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
