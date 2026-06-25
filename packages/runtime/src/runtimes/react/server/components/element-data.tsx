import { type ReactNode } from 'react'

import { partitionRecord } from '../../../../utils/partition'

import {
  type State,
  type ElementData,
  getReactComponent,
  getComponentPropControllerDescriptors,
} from '../../../../state/read-only-state'

import { FallbackComponent } from '../../../../components/shared/FallbackComponent'
import { isLegacyDescriptor } from '../../../../prop-controllers/descriptors'

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

  const [legacyDescriptors, definitions] = getControlDefs(state, elementData)
  const legacyKeys = Object.keys(legacyDescriptors)
  if (legacyKeys.length > 0) {
    console.warn(`Unexpected legacy control data in server element '${elementData.key}`, {
      elementData,
      legacyKeys,
    })
  }

  const props = await resolveProps(context, elementData, definitions)

  return <Component key={elementData.key} {...props} />
}

const getControlDefs = (state: State, elementData: ElementData) => {
  const descriptors = getComponentPropControllerDescriptors(state, elementData.type) ?? {}
  return partitionRecord(descriptors, isLegacyDescriptor)
}
