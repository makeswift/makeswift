import { type ReactNode } from 'react'

import { partitionRecord } from '../../../../utils/partition'

import {
  type State,
  type ElementData,
  getReactComponent,
  getBreakpoints,
  getComponentPropControllerDescriptors,
} from '../../../../state/read-only-state'

import { FallbackComponent } from '../../../../components/shared/FallbackComponent'
import { isLegacyDescriptor } from '../../../../prop-controllers/descriptors'

import {
  ServerCSSCollector,
  createCollectingServerStylesheet,
  InjectServerCSS,
} from '../css/server-css'
import { type ServerRenderContext, getStore } from '../render-context'
import { resolveProps } from '../resolve-props'

export async function ServerElementData({
  documentKey,
  context,
  elementData,
}: {
  documentKey: string
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

  const cssCollector = new ServerCSSCollector()
  const stylesheet = createCollectingServerStylesheet(
    cssCollector,
    getBreakpoints(state),
    elementData.key,
  )

  const props = await resolveProps(context, elementData, documentKey, definitions, stylesheet)

  return (
    <>
      {/* Make the component the first child so that `findDOMNode` resolves to its first
        rendered DOM node (if any) rather than the component's `<style>` element */}
      <Component
        key={elementData.key}
        {...props}
        // unstable_elementKey is needed to provide a stable reference
        // Do not remove this unless you're sure it isn't referenced by other repositories.
        unstable_elementKey={elementData.key}
      />
      <InjectServerCSS collector={cssCollector} elementKey={elementData.key} />
    </>
  )
}

const getControlDefs = (state: State, elementData: ElementData) => {
  const descriptors = getComponentPropControllerDescriptors(state, elementData.type) ?? {}
  return partitionRecord(descriptors, isLegacyDescriptor)
}
