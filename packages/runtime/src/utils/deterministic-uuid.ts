import crypto from 'crypto'
import { canonicalize } from './canonicalize'

/**
 * Generates a deterministic UUID using SHA-256.
 * @param value - The value to generate the UUID from.
 * @returns A deterministic UUID string.
 */
export function deterministicUUID(value: any): string {
  const canonicalString = canonicalize(value)

  const hash = crypto.createHash('sha256').update(canonicalString).digest()

  // Take the first 16 bytes (128 bits) for the UUID
  const uuidBytes = hash.slice(0, 16)

  // Set the version and variant bits according to RFC 4122
  uuidBytes[6] = (uuidBytes[6] & 0x0f) | 0x80 // Version 8 for custom implementations
  uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80 // RFC 4122 variant

  // Convert bytes to UUID string format
  const uuid = [
    uuidBytes.slice(0, 4).toString('hex'),
    uuidBytes.slice(4, 6).toString('hex'),
    uuidBytes.slice(6, 8).toString('hex'),
    uuidBytes.slice(8, 10).toString('hex'),
    uuidBytes.slice(10, 16).toString('hex'),
  ].join('-')

  return uuid
}
