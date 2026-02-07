import { ControlDefinition as UnifiedControlDefinition } from '@makeswift/controls'

import { type LegacyDescriptor, type DescriptorValueType } from '../../prop-controllers/descriptors'

import { supportsActivity } from './components/activity-with-fallback'

import {
  registerComponentEffect,
  registerReactComponentEffect,
} from '../../state/actions/internal/read-only-actions'

import { ComponentIcon } from '../../state/modules/components-meta'
import type { ComponentType } from '../../state/read-only-state'

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
      /**
       * In React <= 19.1, controls the default `<Suspense>` boundary.
       * Ignored in React >= 19.2; components are always wrapped in `<Activity>`.
       * Defaults to `true`.
       */
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

    if (supportsActivity() && builtinSuspense !== undefined) {
      console.warn(
        'builtinSuspense is ignored in React >= 19.2; components are always wrapped in <Activity>.',
      )
    }

    const unregisterReactComponent = this.store.dispatch(
      registerReactComponentEffect(type, component as unknown as ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }
}
