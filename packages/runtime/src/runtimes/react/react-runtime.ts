import { registerBuiltinComponents } from '../../components/builtin/register'
import { PropControllerDescriptor, PropControllerDescriptorValueType } from '../../prop-controllers'
import { registerComponentEffect, registerReactComponentEffect } from '../../state/actions'
import {
  Breakpoints,
  BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

import { ComponentIcon } from '../../state/modules/components-meta'

export { type CopyContext, type SerializableReplacementContext } from '@makeswift/controls'

import type { ComponentType, Data, Element, ElementData, Store } from '../../state/react-page'

import {
  configureStore,
  copyElementTree,
  getBreakpoints,
  getElementTreeTranslatableData,
  mergeElementTreeTranslatedData,
} from '../../state/react-page'

export class ReactRuntime {
  // TODO: the static methods here are deprecated and only keep here for backward-compatibility purpose.
  // We will remove them when we release a new breaking change.
  // ------------------ Deprecated API ------------------ //
  static store = configureStore()
  static registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ComponentType<{ [K in keyof P]: PropControllerDescriptorValueType<P[K]> }>,
  >(
    component: C,
    {
      type,
      label,
      icon = ComponentIcon.Code,
      hidden = false,
      props,
    }: { type: string; label: string; icon?: ComponentIcon; hidden?: boolean; props?: P },
  ): () => void {
    const unregisterComponent = this.store.dispatch(
      registerComponentEffect(type, { label, icon, hidden }, props ?? {}),
    )

    const unregisterReactComponent = this.store.dispatch(
      registerReactComponentEffect(type, component as unknown as ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }

  static copyElementTree(
    elementTree: ElementData,
    replacementContext: SerializableReplacementContext,
  ): Element {
    return copyElementTree(this.store.getState(), elementTree, replacementContext)
  }

  static getBreakpoints(): Breakpoints {
    return getBreakpoints(this.store.getState())
  }

  static getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  static mergeTranslatedData(
    elementTree: ElementData,
    translatedData: Record<string, Data>,
  ): Element {
    return mergeElementTreeTranslatedData(this.store.getState(), elementTree, translatedData)
  }
  // ------------------ Deprecated API ends here ------------------ //

  store: Store

  registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ComponentType<{ [K in keyof P]: PropControllerDescriptorValueType<P[K]> }>,
  >(
    component: C,
    {
      type,
      label,
      icon = ComponentIcon.Cube,
      hidden = false,
      props,
    }: { type: string; label: string; icon?: ComponentIcon; hidden?: boolean; props?: P },
  ): () => void {
    const unregisterComponent = this.store.dispatch(
      registerComponentEffect(type, { label, icon, hidden }, props ?? {}),
    )

    const unregisterReactComponent = this.store.dispatch(
      registerReactComponentEffect(type, component as unknown as ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }

  copyElementTree(
    elementTree: ElementData,
    replacementContext: SerializableReplacementContext,
  ): Element {
    return copyElementTree(this.store.getState(), elementTree, replacementContext)
  }

  getBreakpoints(): Breakpoints {
    return getBreakpoints(this.store.getState())
  }

  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    this.store = configureStore({
      breakpoints: breakpoints ? parseBreakpointsInput(breakpoints) : undefined,
    })

    registerBuiltinComponents(this)
  }

  getTranslatableData(elementTree: ElementData): Record<string, Data> {
    return getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  mergeTranslatedData(elementTree: ElementData, translatedData: Record<string, Data>): Element {
    return mergeElementTreeTranslatedData(this.store.getState(), elementTree, translatedData)
  }
}

// TODO: We should delete this once we remove the static methods in ReactRuntime.
registerBuiltinComponents(ReactRuntime)
