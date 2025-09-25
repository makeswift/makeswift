// Server action validation based on React's internal implementation
// https://github.com/facebook/react/blob/f739642745577a8e4dcb9753836ac3589b9c590a/packages/react-server-dom-webpack/src/ReactFlightWebpackReferences.js#L26-L35
const SERVER_REFERENCE_TAG = Symbol.for('react.server.reference')

export function isServerAction(reference: unknown): boolean {
  return (
    typeof reference === 'function' &&
    '$$typeof' in reference &&
    reference.$$typeof === SERVER_REFERENCE_TAG
  )
}
