import { registerBuiltinComponents } from '../../components/builtin/register'

import { type Descriptor, type DescriptorValueType } from '../../prop-controllers/descriptors'

import { registerComponentEffect, registerReactComponentEffect } from '../../state/actions'
import { BreakpointsInput } from '../../state/modules/breakpoints'
import { ComponentIcon } from '../../state/modules/components-meta'
import type { ComponentType } from '../../state/react-page'

import { RuntimeCore } from './runtime-core'

function validateComponentType(type: string, component?: ComponentType): void {
  const componentName = component?.name ?? 'Component'
  if (typeof type !== 'string' || type === '') {
    throw new Error(
      `${componentName}: A non-empty string \`type\` is required for component registration, got ${type}`,
    )
  }
}

export class ReactRuntime extends RuntimeCore {
  // TODO: the static methods here are deprecated and only keep here for backward-compatibility purpose.
  // We will remove them when we release a new breaking change.
  // ------------------ Deprecated API ------------------ //
  static registerComponent<
    P extends Record<string, Descriptor>,
    C extends ComponentType<{ [K in keyof P]: DescriptorValueType<P[K]> }>,
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
    validateComponentType(type, component as unknown as ComponentType)

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

  // ------------------ Deprecated API ends here ------------------ //

  registerComponent<
    P extends Record<string, Descriptor>,
    C extends ComponentType<{ [K in keyof P]: DescriptorValueType<P[K]> }>,
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
    validateComponentType(type, component as unknown as ComponentType)

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

  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    super({ breakpoints })

    registerBuiltinComponents(this)
  }
}

// TODO: We should delete this once we remove the static methods in ReactRuntime.
registerBuiltinComponents(ReactRuntime)
