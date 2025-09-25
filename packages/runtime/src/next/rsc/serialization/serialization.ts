import { MakeswiftComponentType } from '../../../components/builtin/constants'
import type { PropControllerDescriptor } from '../../../prop-controllers'
import { State } from '../../../state/react-page'
import { isServerAction } from '../utils/is-server-action'

// RSC-specific types that focus only on what's needed for client hydration
export type RSCSerializedPropController = {
  type: string
  options: Record<string, unknown>
}

export type SerializedServerState = {
  componentsMeta: State['componentsMeta']
  propControllers: Map<string, Record<string, RSCSerializedPropController>>
}

function validateAndSerializeValue(value: unknown, context: string): unknown {
  if (typeof value === 'function') {
    if (isServerAction(value)) {
      // Server actions can be serialized
      return value
    } else {
      throw new Error(
        `Cannot serialize function in ${context}. Only server actions are allowed in RSC serialization. ` +
          `Convert the function to a server action by using the "use server" directive.`,
      )
    }
  }

  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map((item, index) => validateAndSerializeValue(item, `${context}[${index}]`))
    } else {
      const serialized: Record<string, unknown> = {}
      for (const [key, val] of Object.entries(value)) {
        serialized[key] = validateAndSerializeValue(val, `${context}.${key}`)
      }
      return serialized
    }
  }

  // Primitive values are safe to serialize
  return value
}

function serializePropController(
  descriptor: PropControllerDescriptor,
  componentType: string,
  propName: string,
): RSCSerializedPropController {
  const context = `component "${componentType}" prop "${propName}"`

  if ('serialize' in descriptor) {
    // Unified control definitions - serialize using built-in method with validation
    const [serializedRecord, transferables] = descriptor.serialize()

    // Validate that no transferables are included (not supported in RSC)
    if (transferables.length > 0) {
      throw new Error(
        `Cannot serialize control with transferables for ${context}. ` +
          `Transferables are not supported in RSC serialization.`,
      )
    }

    // Validate the serialized record for functions
    const validatedRecord = validateAndSerializeValue(serializedRecord, context) as Record<
      string,
      unknown
    >

    return {
      type: serializedRecord.type,
      options: validatedRecord,
    }
  } else {
    // Skip legacy descriptors - we only want unified controls
    throw new Error(
      `Cannot serialize legacy descriptor for ${context}. ` +
        `Only unified control definitions are supported in RSC serialization. ` +
        `Convert to a unified control definition first.`,
    )
  }
}

function serializePropControllers(
  descriptors: Record<string, PropControllerDescriptor>,
  componentType: string,
): Record<string, RSCSerializedPropController> {
  const serialized: Record<string, RSCSerializedPropController> = {}

  for (const [propName, descriptor] of Object.entries(descriptors)) {
    serialized[propName] = serializePropController(descriptor, componentType, propName)
  }

  return serialized
}

export function serializeServerState(state: State) {
  const propControllers = new Map<string, Record<string, RSCSerializedPropController>>()

  for (const [componentType, descriptors] of state.propControllers.entries()) {
    // Filter out built-in components since they contain functions that can't be serialized
    // For example: GapY(props => ({ hidden: props.children == null }))
    if (Object.values(MakeswiftComponentType).includes(componentType as any)) {
      continue
    }

    try {
      const serializedDescriptors = serializePropControllers(descriptors, componentType)
      propControllers.set(componentType, serializedDescriptors)
    } catch (error) {
      // Re-throw with component context
      if (error instanceof Error) {
        throw new Error(
          `Failed to serialize prop controllers for component "${componentType}": ${error.message}`,
        )
      }
      throw error
    }
  }

  return {
    componentsMeta: state.componentsMeta,
    propControllers: propControllers,
  }
}

function deserializePropController(
  serialized: RSCSerializedPropController,
): PropControllerDescriptor {
  // For RSC deserialization, we need to reconstruct the unified control definition
  try {
    // Reconstruct the full serialized record with type and other properties
    const fullRecord = {
      type: serialized.type,
      ...serialized.options,
    }

    // Deserialize using the unified controls system
    const deserializedRecord = deserializeRecord(fullRecord as any)

    // The deserializeRecord returns a unified control definition, but we need to cast it properly
    // since the type system can't infer the exact relationship
    return deserializedRecord as unknown as PropControllerDescriptor
  } catch (error) {
    throw new Error(
      `Failed to deserialize unified control "${serialized.type}": ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

function deserializePropControllers(
  serializedDescriptors: Record<string, RSCSerializedPropController>,
): Record<string, PropControllerDescriptor> {
  const deserialized: Record<string, PropControllerDescriptor> = {}

  for (const [propName, serialized] of Object.entries(serializedDescriptors)) {
    deserialized[propName] = deserializePropController(serialized)
  }

  return deserialized
}

export function deserializeServerState(serializedState: SerializedServerState): Partial<State> {
  const propControllersEntries = Array.from(serializedState.propControllers.entries()).map(
    ([componentType, serializedControls]) => {
      const deserializedControls = deserializePropControllers(serializedControls)
      return [componentType, deserializedControls] as const
    },
  )

  return {
    componentsMeta: serializedState.componentsMeta,
    propControllers: new Map(propControllersEntries),
  }
}
