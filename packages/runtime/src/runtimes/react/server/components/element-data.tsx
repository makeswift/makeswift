import { type ReactNode } from 'react'

import {
  getReactComponent,
  ElementData,
  getComponentPropControllerDescriptors,
} from '../../../../state/read-only-state'

import { FallbackComponent } from '../../../../components/shared/FallbackComponent'

import { type ServerRenderContext, getStore } from '../render-context'

import { resolveProps } from '../resolve-props'

export async function ServerElementData({
  context,
  elementData,
}: {
  context: ServerRenderContext
  elementData: ElementData
}): Promise<ReactNode> {
  const state = getStore(context).getState()

  const Component = getReactComponent(state, elementData.type)
  if (Component == null) {
    return (
      <FallbackComponent
        text="Component not found"
        details={`Unknown component '${elementData.type}'`}
      />
    )
  }

  const descriptors = getComponentPropControllerDescriptors(state, elementData.type)
  if (descriptors == null) {
    const message = `Descriptors not found for '${elementData.type}'`
    console.error(message, { elementData })
    return <FallbackComponent text="Component error" details={message} />
  }

  const props = await resolveProps(context, elementData, descriptors)

  return <Component key={elementData.key} {...props} />
}
