import {
  getReactComponent,
  ElementData as ReactPageElementData,
  getComponentPropControllerDescriptors,
} from '../../../state/react-page'
import { FallbackComponent } from '../../../components/shared/FallbackComponent'
import { getRuntime } from './runtime'
import { resolveProps } from './resolve-props'
import { ReactNode } from 'react'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export async function ServerElementData({ elementData }: ElementDataProps): Promise<ReactNode> {
  const state = getRuntime().store.getState()
  const Component = getReactComponent(state, elementData.type)

  let descriptors = getComponentPropControllerDescriptors(state, elementData.type)

  if (descriptors == null) {
    return <FallbackComponent text={`Descriptors not found for ${elementData.type}`} />
  }

  const props = resolveProps(elementData.props, descriptors, elementData.key)

  if (Component == null) {
    return <FallbackComponent text="Component not found" />
  }

  return <Component {...props} key={elementData.key} />
}
