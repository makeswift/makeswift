import { Descriptor } from './descriptors'

function defaultCopy(props: any) {
  return props
}

export function getCopyFunction(descriptor: Descriptor) {
  switch (descriptor.type) {
    default:
      return defaultCopy
  }
}
