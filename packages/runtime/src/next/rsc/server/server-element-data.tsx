import { getReactComponent, ElementData } from '../../../state/read-only-state'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { getRuntime } from './runtime'
import { ReactNode } from 'react'

type Props = {
  elementData: ElementData
  resolvedProps: Record<string, unknown>
}

export function ServerElementData({ elementData, resolvedProps }: Props): ReactNode {
  const state = getRuntime().protoStore.getState()
  const Component = getReactComponent(state, elementData.type)

  if (Component == null) {
    return <FallbackComponent text="Component not found" />
  }

  return <Component {...resolvedProps} key={elementData.key} />
}
