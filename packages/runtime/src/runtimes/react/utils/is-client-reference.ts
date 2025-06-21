// RSC turns `import Button from './Button'` (where Button.tsx
// begins with `"use client"`) into an *object* (actually a Proxy) whose
// `$$typeof` field equals Symbol.for('react.client.reference').
// See https://github.com/facebook/react/blob/f739642745577a8e4dcb9753836ac3589b9c590a/packages/react-server-dom-webpack/src/ReactFlightWebpackReferences.js#L26-L31
export const CLIENT_REFERENCE_TAG = Symbol.for('react.client.reference')

export function isClientReference(reference: Object): boolean {
  return reference != null && '$$typeof' in reference && reference.$$typeof === CLIENT_REFERENCE_TAG
}
