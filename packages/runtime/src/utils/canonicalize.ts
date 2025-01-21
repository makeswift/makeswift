/**
 * Canonicalizes a value to a consistent string representation.
 * @param value - The value to canonicalize.
 * @returns A string that consistently represents the value.
 */
export function canonicalize(value: any): string {
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']'
  } else if (value && typeof value === 'object') {
    return (
      '{' +
      Object.keys(value)
        .sort()
        .map(key => {
          return JSON.stringify(key) + ':' + canonicalize(value[key])
        })
        .join(',') +
      '}'
    )
  } else {
    return JSON.stringify(value)
  }
}
