import { type ControlDefinition as UnifiedControlDefinition } from '@makeswift/controls'

import { ReactRuntime, validateComponentType } from '../../../runtimes/react/react-runtime'
import {
  type LegacyDescriptor,
  type DescriptorValueType,
} from '../../../prop-controllers/descriptors'
import { registerComponentEffect, registerReactComponentEffect } from '../../../state/actions'
import { ComponentIcon } from '../../../state/modules/components-meta'
import type { ComponentType, Data, State } from '../../../state/react-page'
import { serializeControls, deserializeControls, SerializedControl } from '../../../builder'
import { PropControllerDescriptor } from '../../../state/modules/prop-controllers'

export type SerializedServerState = {
  componentsMeta: State['componentsMeta']
  propControllers: Map<string, Record<string, SerializedControl<Data>>>
}

export class NextRSCRuntime extends ReactRuntime {
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

  serializeServerState(): SerializedServerState {
    const componentsMeta = this.store.getState().componentsMeta
    const propControllers = new Map(
      Array.from(this.store.getState().propControllers.entries())
        // Only serialize server components. Client components will be imported again on the client bundle.
        .filter(([componentType]) => componentsMeta.get(componentType)?.server === true)
        .map(([componentType, descriptors]) => {
          const [serializedControls] = serializeControls(descriptors)
          return [componentType, serializedControls] as const
        }),
    )

    return {
      componentsMeta: this.store.getState().componentsMeta,
      propControllers: propControllers,
    }
  }

  loadServerState(serializedState: SerializedServerState): void {
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
