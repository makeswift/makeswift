import { type ResourceResolver, createResourceResolver } from '../resource-resolver'

import { type ServerRenderContext, getStore } from './render-context'

export function serverResourceResolver(
  context: ServerRenderContext & { documentKey: string },
): ResourceResolver {
  const store = getStore(context)
  const apiClient = store.apiResourcesClient

  return createResourceResolver({
    store,
    apiClient,
    documentKey: context.documentKey,
    locale: context.locale ?? null,
  })
}
