import { useRef } from 'react'

import { useStore } from '.'
import * as ReactPage from '../../state/react-page'
import { Props } from '../../prop-controllers'
import {
  Descriptor,
  DescriptorValueType,
  ResponsiveColorValue,
  ResponsiveValue,
} from '../../prop-controllers/descriptors'
import { useColor } from '../../components'
import type { ColorValue } from '../../components/utils/types'

export type ResponsiveColor = ResponsiveValue<ColorValue>

function useResponsiveColor(value: ResponsiveColorValue): ResponsiveColor | null | undefined {
  return useColor(value)
}

export function useProps(
  props: Record<string, any>,
  componentType: string,
): Record<string, unknown> {
  const store = useStore()
  const propControllerDescriptorsRef = useRef(
    ReactPage.getComponentPropControllerDescriptors(store.getState(), componentType) ?? {},
  )

  return Object.fromEntries(
    Object.entries(propControllerDescriptorsRef.current).map(([propName, descriptor]) => {
      switch (descriptor.type) {
        case Props.Types.ResponsiveColor: {
          const color = useResponsiveColor(props[propName])

          return [propName, color]
        }

        default:
          return [propName, props[propName]]
      }
    }),
  )
}

export type MappedDescriptorValueType<T extends Descriptor> =
  T['type'] extends typeof Props.Types.ResponsiveColor ? ResponsiveColor : DescriptorValueType<T>
