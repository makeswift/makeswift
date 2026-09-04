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

import { type ServerRenderContext, getStore } from '../render-context'
import { resolveProps } from '../resolve-props'
import { StylesheetEngine } from '../../css-runtime/stylesheet-engine'
import { type ControlledStyleData } from '../../css-runtime/types'
import { RSCEmittedStyle } from '../../css-runtime/components/rsc-emitted-style'

export async function ServerElementData({
  documentKey,
  context,
  elementData,
  injectedProps,
}: {
  documentKey: string
  context: ServerRenderContext
  elementData: ElementData
  injectedProps: Record<string, unknown>
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

  const classStyleData = new Map<string, ControlledStyleData>()
  const stylesheet = new StylesheetEngine({
    breakpointsData: getBreakpoints(state),
    classNamePrefix: context.rootStyleProps?.classNamePrefix,
    documentKey,
    elementKey: elementData.key,
    propPathComponents: [],
    onDefineStyle: styleData => {
      const { onBoxModelChange, ...serializableStyleData } = styleData
      classStyleData.set(styleData.className, serializableStyleData)
    },
  })

  const props = {
    ...(await resolveProps(context, elementData, documentKey, definitions, stylesheet)),
    ...injectedProps,
  }

  const styleElements = Array.from(classStyleData, ([className, styleData]) => (
    <RSCEmittedStyle key={className} namespace={elementData.key} serializableData={styleData} />
  ))

  return (
    <>
      {/* Make the component the first child so that `findDOMNode` resolves to its first
        rendered DOM node (if any) rather than the component's `<style>` element */}
      <Component key={elementData.key} {...props} />
      {styleElements}
    </>
  )
}

const getControlDefs = (state: State, elementData: ElementData) => {
  const descriptors = getComponentPropControllerDescriptors(state, elementData.type) ?? {}
  return partitionRecord(descriptors, isLegacyDescriptor)
}
