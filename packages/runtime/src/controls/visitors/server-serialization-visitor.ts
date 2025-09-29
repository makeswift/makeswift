import { AnyFunction, SerializationPlugin } from '@makeswift/controls'

import { BaseControlSerializationVisitor } from './base-control-serialization-visitor'

// https://github.com/facebook/react/blob/f739642745577a8e4dcb9753836ac3589b9c590a/packages/react-server-dom-webpack/src/ReactFlightWebpackReferences.js#L26-L35
const SERVER_REFERENCE_TAG = Symbol.for('react.server.reference')

function isServerReference(reference: unknown): boolean {
  return (
    typeof reference === 'function' &&
    '$$typeof' in reference &&
    reference.$$typeof === SERVER_REFERENCE_TAG
  )
}

export class ServerSerializationVisitor extends BaseControlSerializationVisitor {
  constructor() {
    const serializeFunctionPlugin: SerializationPlugin<AnyFunction> = {
      match: isServerReference,
      serialize: (val: AnyFunction) => val,
    }

    super([serializeFunctionPlugin])
  }
}
