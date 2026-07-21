import { type ResourceResolver, createResourceResolver } from '../resource-resolver'

import { type ServerRenderContext, getStore } from './render-context'

export function serverResourceResolver(context: ServerRenderContext): ResourceResolver {
  const store = getStore(context)
  const apiClient = store.apiResourcesClient

  return createResourceResolver({
    store,
    apiClient,
    documentKey: null, // FIXME
    locale: context.locale ?? null,
  })
}
