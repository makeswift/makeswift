import {
  ResourceResolver,
  type ResolvableValue,
  resolved,
} from './resource-resolver'
import { type ElementData } from './common'
import { controlTraitsRegistry } from './registry'

export function resolveControlValue(
  elementData: ElementData,
  definition: { type: string },
  resourceResolver: ResourceResolver,
): ResolvableValue<any> {
  const traits = controlTraitsRegistry.get(definition.type)
  if (traits) {
    const controlValue = traits.fromData(elementData, definition as any)
    return traits.resolveValue(
      controlValue,
      definition as any,
      resourceResolver,
    )
  }

  return resolved(undefined)
}
