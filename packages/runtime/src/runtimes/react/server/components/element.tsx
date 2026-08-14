import { ReactNode } from 'react'

import {
  isElementReference,
  getComponentsMeta,
  type Element as ElementDataOrRef,
} from '../../../../state/read-only-state'

import { FallbackComponent } from '../../../../components/shared/FallbackComponent'

import { Element as ClientElement } from '../../components/Element'

import { type ServerRenderContext, getStore } from '../render-context'

import { ServerElementData } from './element-data'

export function ServerElement({
  context,
  element,
  documentKey,
}: {
  context: ServerRenderContext
  element: ElementDataOrRef
  documentKey: string
}): ReactNode {
  // check for element references first to avoid looking them up as regular components
  if (isElementReference(element)) {
    return <FallbackComponent text="Element reference is not supported on server yet" />
  }

  const state = getStore(context).getState()
  const elementMeta = getComponentsMeta(state).get(element.type)
  if (elementMeta == null) {
    return (
      <FallbackComponent
        text="Component not found"
        details={`Missing component metadata for '${element.type}'`}
      />
    )
  }

  const isRSC = elementMeta.server ?? false
  if (!isRSC) {
    return <ClientElement key={element.key} element={element} />
  }

  return <ServerElementData documentKey={documentKey} context={context} elementData={element} />
}
