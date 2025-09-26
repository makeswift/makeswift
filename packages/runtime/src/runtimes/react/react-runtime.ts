import { registerBuiltinComponents } from '../../components/builtin/register'
import { ControlDefinition as UnifiedControlDefinition } from '@makeswift/controls'

import { type LegacyDescriptor, type DescriptorValueType } from '../../prop-controllers/descriptors'

import { registerComponentEffect, registerReactComponentEffect } from '../../state/actions'
import { BreakpointsInput } from '../../state/modules/breakpoints'
import { ComponentIcon } from '../../state/modules/components-meta'
import type { ComponentType, Data, State } from '../../state/react-page'

import { RuntimeCore } from './runtime-core'
import { serializeControls, deserializeControls, SerializedControl } from '../../builder'
import { PropControllerDescriptor } from '../../state/modules/prop-controllers'
import { MakeswiftComponentType } from '../../components/builtin/constants'

function validateComponentType(type: string, component?: ComponentType): void {
  const componentName = component?.name ?? 'Component'
  if (typeof type !== 'string' || type === '') {
    throw new Error(
      `${componentName}: A non-empty string \`type\` is required for component registration, got ${type}`,
    )
  }
}

export type SerializedServerState = {
  componentsMeta: State['componentsMeta']
  propControllers: Map<string, Record<string, SerializedControl<Data>>>
}

export class ReactRuntime extends RuntimeCore {
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
      description,
      server = false,
    }: {
      type: string
      label: string
      icon?: ComponentIcon
      hidden?: boolean
      props?: P
      description?: string
      server?: boolean
    },
  ): () => void {
    validateComponentType(type, component as unknown as ComponentType)

    const unregisterComponent = this.store.dispatch(
      registerComponentEffect(type, { label, icon, hidden, description, server }, props ?? {}),
    )

    const unregisterReactComponent = this.store.dispatch(
      registerReactComponentEffect(type, component as unknown as ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }

  serializeServerState() {
    const propControllersEntries = Array.from(
      this.store
        .getState()
        .propControllers.entries()
        .filter(
          ([componentType]) =>
            // Filter out built-in components since we can't serialize them because they contain functions.
            // For example: GapY(props => ({ hidden: props.children == null }))
            !Object.values(MakeswiftComponentType).includes(componentType as any),
        ),
    ).map(([componentType, descriptors]) => {
      const [serializedControls] = serializeControls(descriptors)
      return [componentType, serializedControls] as const
    })

    return {
      componentsMeta: this.store.getState().componentsMeta,
      propControllers: new Map(propControllersEntries),
    }
  }

  loadServerState(serializedState: SerializedServerState) {
    const deserializedState = deserializeServerState(serializedState)

    // Register each component using the proper actions
    if (deserializedState.componentsMeta && deserializedState.propControllers) {
      for (const [componentType, propControllerDescriptors] of deserializedState.propControllers) {
        const componentMeta = deserializedState.componentsMeta.get(componentType)
        if (componentMeta) {
          this.store.dispatch(
            registerComponentEffect(componentType, componentMeta, propControllerDescriptors),
          )
        }
      }
    }
  }

  constructor({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
    super({ breakpoints })

    registerBuiltinComponents(this)
  }
}

export function deserializeServerState(serializedState: SerializedServerState): Partial<State> {
  const propControllersEntries = Array.from(serializedState.propControllers.entries()).map(
    ([componentType, serializedControls]) => {
      const deserializedControls = deserializeControls(serializedControls) as Record<
        string,
        PropControllerDescriptor
      >
      return [componentType, deserializedControls] as const
    },
  )

  return {
    componentsMeta: serializedState.componentsMeta,
    propControllers: new Map(propControllersEntries),
  }
}
