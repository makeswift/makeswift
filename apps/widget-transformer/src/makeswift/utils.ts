import { MakeswiftComponentSnapshot } from '@makeswift/runtime/client'
import { randomUUID } from 'crypto'

export function generateEmptyComponentSnapshot(): MakeswiftComponentSnapshot {
  return {
    document: {
      id: randomUUID(),
      locale: null,
      data: null,
    },
    key: randomUUID(),
    cacheData: {
      apiResources: {},
      localizedResourcesMap: {},
    },
    meta: {
      allowLocaleFallback: false,
      requestedLocale: null,
    },
  }
}
