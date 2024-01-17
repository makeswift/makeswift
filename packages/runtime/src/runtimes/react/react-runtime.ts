import * as ReactPage from '../../state/react-page'
import { registerComponentEffect, registerReactComponentEffect } from '../../state/actions'
import type {
  PropControllerDescriptor,
  PropControllerDescriptorValueType,
} from '../../prop-controllers'
import { ComponentIcon } from '../../state/modules/components-meta'
import { registerBuiltinComponents } from '../../components/builtin/register'
import {
  Breakpoints,
  BreakpointsInput,
  parseBreakpointsInput,
} from '../../state/modules/breakpoints'

export class ReactRuntime {
  // TODO: the static methods here are deprecated and only keep here for backward-compatibility purpose.
  // We will remove them when we release a new breaking change.
  // ------------------ Deprecated API ------------------ //
  static store = ReactPage.configureStore()
  static registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ReactPage.ComponentType<{ [K in keyof P]: PropControllerDescriptorValueType<P[K]> }>,
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
      registerReactComponentEffect(type, component as unknown as ReactPage.ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }
  static copyElementTree(
    elementTree: ReactPage.ElementData,
    replacementContext: ReactPage.SerializableReplacementContext,
  ): ReactPage.Element {
    return ReactPage.copyElementTree(this.store.getState(), elementTree, replacementContext)
  }
  static getBreakpoints(): Breakpoints {
    return ReactPage.getBreakpoints(this.store.getState())
  }

  static getTranslatableData(elementTree: ReactPage.ElementData): Record<string, ReactPage.Data> {
    return ReactPage.getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  static mergeTranslatedData(
    elementTree: ReactPage.ElementData,
    translatedData: Record<string, ReactPage.Data>,
  ): ReactPage.Element {
    return ReactPage.mergeElementTreeTranslatedData(
      this.store.getState(),
      elementTree,
      translatedData,
    )
  }
  // ------------------ Deprecated API ends here ------------------ //

  store: ReactPage.Store

  registerComponent<
    P extends Record<string, PropControllerDescriptor>,
    C extends ReactPage.ComponentType<{ [K in keyof P]: PropControllerDescriptorValueType<P[K]> }>,
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
      registerReactComponentEffect(type, component as unknown as ReactPage.ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }
  copyElementTree(
    elementTree: ReactPage.ElementData,
    replacementContext: ReactPage.SerializableReplacementContext,
  ): ReactPage.Element {
    return ReactPage.copyElementTree(this.store.getState(), elementTree, replacementContext)
  }
  getBreakpoints(): Breakpoints {
    return ReactPage.getBreakpoints(this.store.getState())
  }

  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    this.store = ReactPage.configureStore({
      breakpoints: breakpoints ? parseBreakpointsInput(breakpoints) : undefined,
    })

    registerBuiltinComponents(this)
  }

  getTranslatableData(elementTree: ReactPage.ElementData): Record<string, ReactPage.Data> {
    return ReactPage.getElementTreeTranslatableData(this.store.getState(), elementTree)
  }

  mergeTranslatedData(
    elementTree: ReactPage.ElementData,
    translatedData: Record<string, ReactPage.Data>,
  ): ReactPage.Element {
    return ReactPage.mergeElementTreeTranslatedData(
      this.store.getState(),
      elementTree,
      translatedData,
    )
  }
}
