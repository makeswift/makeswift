import shallowEqual from "./shallowEqual";

const { hasOwnProperty } = Object.prototype;

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (shallowEqual(a, b)) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i += 1) {
    if (
      !hasOwnProperty.call(b, keysA[i]) ||
      // @ts-expect-error: {}[string] is OK.
      !deepEqual(a[keysA[i]], b[keysA[i]])
    )
      return false;
  }

  return true;
};

export default deepEqual;
