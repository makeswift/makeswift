import { ControlDefinition } from '../controls'
import { ControlSerializationVisitor } from '../controls/visitor'
import { AnyFunction, isFunction, SerializationPlugin } from '../serialization'

export class TestSerializationVisitor extends ControlSerializationVisitor {
  constructor() {
    const testSerializeFunctionPlugin: SerializationPlugin<AnyFunction> = {
      match: isFunction,
      serialize: () => ['SerializedFunction'],
    }

    const serializeControlDefinitionPlugin: SerializationPlugin<ControlDefinition> =
      {
        match: (value: unknown) => value instanceof ControlDefinition,
        serialize: (val) => val.accept(this),
      }

    super([testSerializeFunctionPlugin, serializeControlDefinitionPlugin])
  }
}
