import {
  getReactComponent,
  ElementData as ReactPageElementData,
  getComponentPropControllerDescriptors,
} from '../../state/react-page'
import { FallbackComponent } from '../../components/shared/FallbackComponent'
import { getRuntime } from '..'
import { resolveProps } from '../functions/resolve-props'

type ElementDataProps = {
  elementData: ReactPageElementData
}

export const ServerElementData = function ServerElementData({
  elementData,
}: ElementDataProps): JSX.Element {
  const state = getRuntime().store.getState()
  const Component = getReactComponent(state, elementData.type)

  let descriptors = getComponentPropControllerDescriptors(state, elementData.type)

  if (descriptors == null) {
    return <FallbackComponent text="Descriptors not found" />
  }

  const props = resolveProps(elementData.props, descriptors)

  if (Component == null) {
    console.warn(`Unknown component '${elementData.type}'`, { elementData })
    return <FallbackComponent text="Component not found" />
  }

  return <Component {...props} key={elementData.key} />
}
