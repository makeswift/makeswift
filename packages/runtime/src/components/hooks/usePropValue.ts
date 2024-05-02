import { type PropDef, type PropData, type Value } from '@makeswift/prop-controllers'

export function usePropValue<P extends PropDef>(
  propDef: P,
  data: PropData<P> | undefined,
): Value<P> | undefined {
  if (data == null) return data

  return propDef.fromPropData(data)
}
