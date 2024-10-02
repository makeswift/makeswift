import { v5 as uuidv5 } from 'uuid'
import { canonicalize } from './canonicalize'

const NAMESPACE = '00000000-0000-0000-0000-000000000000'

export function deterministicUUID(value: any): string {
  const canonicalString = canonicalize(value)

  return uuidv5(canonicalString, NAMESPACE)
}
