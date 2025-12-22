import { ControlDefinition as UnifiedControlDefinition } from '@makeswift/controls'

import { type LegacyDescriptor, type DescriptorValueType } from '../../prop-controllers/descriptors'

import { registerComponentEffect, registerReactComponentEffect } from '../../state/actions/internal'

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

export class ReactRuntimeCore extends RuntimeCore {
  registerComponent<
    ControlDef extends UnifiedControlDefinition,
    P extends Record<string, LegacyDescriptor | ControlDef>,
    C extends ComponentType<{ [K in keyof P]: DescriptorValueType<P[K]> }>,
  >(
    component: C,
    {
      type,
      label,
      icon = ComponentIcon.Cube,
      hidden = false,
      description,
      builtinSuspense,
      props,
    }: {
      type: string
      label: string
      icon?: ComponentIcon
      hidden?: boolean
      description?: string
      builtinSuspense?: boolean
      props?: P
    },
  ): () => void {
    validateComponentType(type, component as unknown as ComponentType)

    const unregisterComponent = this.store.dispatch(
      registerComponentEffect(
        type,
        { label, icon, hidden, description, builtinSuspense },
        props ?? {},
      ),
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
  }
}
