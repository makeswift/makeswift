import { type ReactNode } from 'react'

import { mapValues } from '@makeswift/controls'

import { getComponentsMeta, type ElementData } from '../../../../state/read-only-state'

import { FallbackComponent } from '../../../../components/shared/FallbackComponent'

import { Element as ClientElement } from '../../components/Element'

import { type ServerRenderContext, getStore } from '../render-context'
import { type InjectableProps } from '../injectable-props'

import { ServerElementData } from './element-data'

/**
 * Renders element data on the server. Unlike the client `Element` component, this
 * component explicitly accepts element data only. Element references are followed
 * and resolved during traversal in `collectServerElements`, because the element
 * cache must contain all RSC node entries before it is passed across the client
 * boundary. Discovering references during `ServerElement` rendering would be too
 * late: at that point React has already snapshotted the cache entries for
 * serialization, so any newly added entries would not reach the client.
 */
export function ServerElement({
  context,
  elementData,
  documentKey,
}: {
  context: ServerRenderContext
  elementData: ElementData
  documentKey: string
}): ReactNode {
  const state = getStore(context).getState()
  const elementMeta = getComponentsMeta(state).get(elementData.type)
  if (elementMeta == null) {
    return (
      <FallbackComponent
        text="Component not found"
        details={`Missing component metadata for '${elementData.type}'`}
      />
    )
  }

  const elementKey = elementData.key
  const isRSC = elementMeta.server ?? false
  if (!isRSC) {
    return <ClientElement key={elementKey} element={elementData} />
  }

  const injectableProps: InjectableProps = {
    elementKey,
    documentKey,
  }

  const injectedProps = mapValues(
    elementMeta.injectedProps ?? {},
    propName => injectableProps[propName],
  )

  return (
    <ServerElementData
      documentKey={documentKey}
      context={context}
      elementData={elementData}
      injectedProps={injectedProps}
    />
  )
}
