import { ReactNode } from 'react'

import {
  isElementReference,
  type Element as ElementDataOrRef,
} from '../../../../state/read-only-state'

import { FallbackComponent } from '../../../../components/shared/FallbackComponent'

import { Element as ClientElement } from '../../components/Element'

import { type ServerRenderContext, getStore } from '../render-context'

import { ServerElementData } from './element-data'

export function ServerElement({
  context,
  element,
}: {
  context: ServerRenderContext
  element: ElementDataOrRef
}): ReactNode {
  const state = getStore(context).getState()
  const elementMeta = state.componentsMeta.get(element.type)

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

  if (isElementReference(element)) {
    return <FallbackComponent text="Element reference is not supported on server yet" />
  }

  return <ServerElementData key={element.key} context={context} elementData={element} />
}
