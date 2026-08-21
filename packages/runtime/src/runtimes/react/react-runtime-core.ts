import {
  ControlDefinition as UnifiedControlDefinition,
  type PropsWithValidContextUsage,
} from '@makeswift/controls'

import { type LegacyDescriptor, type DescriptorValueType } from '../../prop-controllers/descriptors'

import { supportsActivity } from './components/activity-with-fallback'

import {
  registerComponentEffect,
  registerReactComponentEffect,
} from '../../state/actions/internal/read-only-actions'

import { ComponentIcon } from '../../state/modules/components-meta'
import type { ComponentType } from '../../state/read-only-state'

import { RuntimeCore } from './runtime-core'

function validateComponentType({
  type,
  componentName,
}: {
  type: string
  componentName: string
}): void {
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
      unstable_migration,
      server = false,
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
      /**
       * Marks this registration as superseded by `replacementType`. When
       * `replacementType` differs from `type`, the builder offers a way to
       * update existing instances.
       */
      unstable_migration?: { replacementType: string }
      server?: boolean
      props?: P & PropsWithValidContextUsage<P>
    },
  ): () => void {
    validateComponentType(
      // make sure we don't access `component?.name` and trigger loading of the server
      // component unless we're running in the RSC environment
      server && !this.isRSCEnv()
        ? { type, componentName: label || 'Unknown server component' }
        : {
            type,
            componentName: component?.name || label || 'Unknown component',
          },
    )

    const unregisterComponent = this.protoStore.dispatch(
      registerComponentEffect(
        type,
        { label, icon, hidden, description, builtinSuspense, unstable_migration, server },
        props ?? {},
      ),
    )

    if (supportsActivity() && builtinSuspense !== undefined) {
      console.warn(
        'builtinSuspense is ignored in React >= 19.2; components are always wrapped in <Activity>.',
      )
    }

    if (server && !this.isRSCEnv()) {
      // we can't load server components code outside of the RSC environment, but we also
      // don't need to: if everything is set up correctly, React has already rendered and
      // streamed the corresponding React elements to the client for us -- see
      // `ServerElementsCache` and `ElementDataServer`
      return () => {
        unregisterComponent()
      }
    }

    const unregisterReactComponent = this.protoStore.dispatch(
      registerReactComponentEffect(type, component as unknown as ComponentType),
    )

    return () => {
      unregisterComponent()
      unregisterReactComponent()
    }
  }

  protected isRSCEnv() {
    return false
  }
}
