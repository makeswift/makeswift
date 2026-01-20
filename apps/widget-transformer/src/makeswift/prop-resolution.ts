const TYPE_KEY = '@@makeswift/type'

export function resolveProps(props: Record<string, any>) {
  const resolved: Record<string, any> = {}

  for (const [key, value] of Object.entries(props)) {
    if (value && typeof value === 'object' && TYPE_KEY in value) {
      switch (value[TYPE_KEY]) {
        case 'text-input::v1':
          resolved[key] = value.value
          break

        default:
          resolved[key] = value
      }
    } else {
      resolved[key] = value
    }
  }

  return resolved
}
