import { ReactNode } from 'react'
import { isElementReference, type Element as ElementDataOrRef } from '../../state/react-page'
import { ServerElementData } from './ServerElementData'
import { getRuntime } from '../context/server'
import { Element } from '../../react'
import { FallbackComponent } from '../../components/shared/FallbackComponent'

type Props = {
  element: ElementDataOrRef
}

export function ServerElement({ element }: Props): ReactNode {
  const state = getRuntime().store.getState()
  const elementMeta = state.componentsMeta.get(element.type)

  if (elementMeta == null) {
    console.warn(`Unknown component '${element.type}'`, { element })
    return <FallbackComponent text="Component not found" />
  }

  const isRSC = elementMeta.server ?? false

  if (!isRSC) {
    return <Element key={element.key} element={element} />
  }

  return (
    <>
      {isElementReference(element) ? (
        <>Element reference is not supported on server yet</>
      ) : (
        <ServerElementData key={element.key} elementData={element} />
      )}
    </>
  )
}
