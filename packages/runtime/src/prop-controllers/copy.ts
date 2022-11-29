import { Descriptor } from './descriptors'
import { copy as BackgroundsCopy } from './copy/Backgrounds'

function defaultCopy(props: any) {
  return props
}

export function getCopyFunction(descriptor: Descriptor) {
  switch (descriptor.type) {
    case 'Backgrounds':
      return BackgroundsCopy
    default:
      return defaultCopy
  }
}
