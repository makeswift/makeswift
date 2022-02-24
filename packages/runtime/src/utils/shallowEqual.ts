import is from "./is";

const { hasOwnProperty } = Object.prototype;

const shallowEqual = (a: unknown, b: unknown): boolean => {
  if (is(a, b)) return true;

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
    // @ts-expect-error: {}[string] is OK.
    if (!hasOwnProperty.call(b, keysA[i]) || !is(a[keysA[i]], b[keysA[i]]))
      return false;
  }

  return true;
};

export default shallowEqual;
