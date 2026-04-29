import { type ControlDefinition as UnifiedControlDefinition } from '@makeswift/controls'

import { ReactRuntimeCore, validateComponentType } from '../../../runtimes/react/react-runtime-core'
import {
  type LegacyDescriptor,
  type DescriptorValueType,
} from '../../../prop-controllers/descriptors'
import {
  registerComponentEffect,
  registerReactComponentEffect,
} from '../../../state/actions/internal/read-only-actions'
import { ComponentIcon } from '../../../state/modules/components-meta'
import type { ComponentType, Data, State } from '../../../state/read-only-state'
import { deserializeControls, SerializedControl, serializeServerControls } from '../../../builder'
import { PropControllerDescriptor } from '../../../state/modules/prop-controllers'
import { registerBuiltinComponents } from '../../../components/builtin/register'
import { supportsActivity } from '../../../runtimes/react/components/activity-with-fallback'

export type SerializedServerState = {
  componentsMeta: State['componentsMeta']
  propControllers: Map<string, Record<string, SerializedControl<Data>>>
}

export class NextRSCRuntime extends ReactRuntimeCore {
  constructor(...args: ConstructorParameters<typeof ReactRuntimeCore>) {
    super(...args)
    registerBuiltinComponents(this)
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
      description,
      builtinSuspense,
      server = false,
    }: {
      type: string
      label: string
      icon?: ComponentIcon
      hidden?: boolean
      props?: P
      description?: string
      /**
       * In React <= 19.1, controls the default `<Suspense>` boundary.
       * Ignored in React >= 19.2; components are always wrapped in `<Activity>`.
       * Defaults to `true`.
       */
      builtinSuspense?: boolean
      server?: boolean
    },
  ): () => void {
    validateComponentType(type, component as unknown as ComponentType)

    const unregisterComponent = this.protoStore.dispatch(
      registerComponentEffect(type, { label, icon, hidden, description, server }, props ?? {}),
    )

    if (supportsActivity() && builtinSuspense !== undefined) {
      console.warn(
        'builtinSuspense is ignored in React >= 19.2; components are always wrapped in <Activity>.',
      )
    }

    const unregisterReactComponent = this.protoStore.dispatch(
      registerReactComponentEffect(type, component as unknown as ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }

  serializeServerState(): SerializedServerState {
    const componentsMeta = this.protoStore.getState().componentsMeta
    const propControllers = new Map(
      Array.from(this.protoStore.getState().propControllers.entries())
        // Only serialize server components. Client components will be imported again on the client bundle.
        .filter(([componentType]) => componentsMeta.get(componentType)?.server === true)
        .map(([componentType, descriptors]) => {
          const serializedControls = serializeServerControls(descriptors)
          return [componentType, serializedControls] as const
        }),
    )

    return {
      componentsMeta: this.protoStore.getState().componentsMeta,
      propControllers: propControllers,
    }
  }

  loadServerState(serializedState: SerializedServerState): void {
    const deserializedPropControllers = Array.from(serializedState.propControllers.entries()).map(
      ([componentType, serializedControls]) => {
        const deserializedControls = deserializeControls(serializedControls) as Record<
          string,
          PropControllerDescriptor
        >
        return [componentType, deserializedControls] as const
      },
    )

    for (const [componentType, propControllerDescriptors] of deserializedPropControllers) {
      const componentMeta = serializedState.componentsMeta.get(componentType)

      if (componentMeta == null) {
        console.warn(`Component meta not found for ${componentType}`)
        continue
      }

      this.protoStore.dispatch(
        registerComponentEffect(componentType, componentMeta, propControllerDescriptors),
      )
    }
  }
}
