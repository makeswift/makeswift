import { Descriptor, ElementIDValue, GridValue, Types } from './descriptors'
import { Data, Element } from '../state/react-page'

export function getElementChildren<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): Element[] {
  if (prop == null) return []

  switch (descriptor.type) {
    case Types.Grid:
      return (prop as GridValue).elements

    default:
      return []
  }
}

export function getElementId<T extends Data>(
  descriptor: Descriptor<T>,
  prop: T | undefined,
): string | null {
  if (prop == null) return null

  switch (descriptor.type) {
    case Types.ElementID:
      return prop as ElementIDValue

    default:
      return null
  }
}
