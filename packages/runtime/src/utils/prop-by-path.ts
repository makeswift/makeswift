export const getPropByPath = (
  props: Record<string, unknown> | Array<unknown>,
  [key, ...path]: string[],
): unknown => {
  const r = Array.isArray(props) ? props[Number.parseInt(key, 10)] : props[key]
  return path.length > 0 && r != null ? getPropByPath(r as typeof props, path) : r
}

export const getProp = (props: Record<string, unknown>, path: string): unknown =>
  getPropByPath(props, path.split('.'))
