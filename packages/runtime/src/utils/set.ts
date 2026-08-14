// Compatibility helpers for older browsers

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union
export const setUnion = <T>(a: Set<T>, b: Set<T>) =>
  Set.prototype.union != null ? a.union(b) : new Set([...a, ...b.keys()])

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference
export const setDifference = <T>(a: Set<T>, b: Set<T>) =>
  Set.prototype.difference != null
    ? a.difference(b)
    : new Set([...a].filter(value => !b.has(value)))
