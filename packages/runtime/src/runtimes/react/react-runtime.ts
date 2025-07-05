import { registerBuiltinComponents } from '../../components/builtin/register'
import { ControlDefinition as UnifiedControlDefinition } from '@makeswift/controls'

import { type LegacyDescriptor, type DescriptorValueType } from '../../prop-controllers/descriptors'

import { registerComponentEffect, registerReactComponentEffect } from '../../state/actions'
import { BreakpointsInput } from '../../state/modules/breakpoints'
import { ComponentIcon } from '../../state/modules/components-meta'
import type { ComponentType } from '../../state/react-page'

import { RuntimeCore } from './runtime-core'
import { isClientReference } from './utils/is-client-reference'

function validateComponentType(type: string, component?: ComponentType): void {
  const componentName = component?.name ?? 'Component'
  if (typeof type !== 'string' || type === '') {
    throw new Error(
      `${componentName}: A non-empty string \`type\` is required for component registration, got ${type}`,
    )
  }
}

type ComponentRegistrationMeta<
  P extends Record<string, LegacyDescriptor | UnifiedControlDefinition>,
> = {
  type: string
  label: string
  icon: ComponentIcon
  hidden: boolean
  props?: P
}

export type ComponentRegistration<
  P extends Record<string, LegacyDescriptor | UnifiedControlDefinition>,
> = {
  component: ComponentType<{ [K in keyof P]: DescriptorValueType<P[K]> }>
  meta: ComponentRegistrationMeta<P>
}

export class ReactRuntime extends RuntimeCore {
  static connect<
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
      props,
    }: { type: string; label: string; icon?: ComponentIcon; hidden?: boolean; props?: P },
  ): ComponentRegistration<P> {
    return { component, meta: { type, label, icon, hidden, props } }
  }

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

  constructor({
    breakpoints,
    components,
  }: {
    breakpoints?: BreakpointsInput
    components?: Record<string, ComponentRegistration<any>>
  } = {}) {
    super({ breakpoints })

    registerBuiltinComponents(this)

    if (components) {
      for (const [key, registration] of Object.entries(components)) {
        if (isClientReference(registration)) {
          throw new Error(
            `ReactRuntime: failed to register component "${key}".\n` +
              `This component was imported from a file that begins with "use client". ` +
              `Move the "${key}" export from ReactRuntime.connect into a module without "use client".\n` +
              `Read more at https://docs.makeswift.com/developer/reference/runtime`,
          )
        }

        this.registerComponent(registration.component, registration.meta)
      }
    }
  }
}
