import { ReactNode } from 'react'
import { isElementReference, type Element as ElementDataOrRef } from '../../state/react-page'
import { ServerElementData } from './server-element-data'
import { getRuntime } from './runtime'
import { Element } from '../../runtimes/react'
import { FallbackComponent } from '../../components/shared/FallbackComponent'

type Props = {
  element: ElementDataOrRef
}

export function ServerElement({ element }: Props): ReactNode {
  const state = getRuntime().store.getState()
  const elementMeta = state.componentsMeta.get(element.type)

  if (elementMeta == null) {
    return <FallbackComponent text="Component not found" />
  }

  const isRSC = elementMeta.server ?? false

  if (!isRSC) {
    return <Element key={element.key} element={element} />
  }

  if (isElementReference(element)) {
    return <FallbackComponent text="Element reference is not supported on server yet" />
  }

  return <ServerElementData key={element.key} elementData={element} />
}
