import type { DeviceId } from '../types'

/**
 * Maps Makeswift device IDs to Tailwind responsive prefixes.
 *
 * - mobile: no prefix (base styles)
 * - tablet: sm: prefix (640px+)
 * - desktop: lg: prefix (1024px+)
 */
export const DEVICE_TO_PREFIX: Record<DeviceId, string> = {
  mobile: '',
  tablet: 'sm:',
  desktop: 'lg:',
}

/**
 * Adds a responsive prefix to a Tailwind class based on device ID.
 */
export function addDevicePrefix(cls: string, deviceId: DeviceId | string): string {
  const prefix = DEVICE_TO_PREFIX[deviceId as DeviceId] || ''
  return `${prefix}${cls}`
}

/**
 * Gets the responsive prefix for a device ID.
 */
export function getDevicePrefix(deviceId: DeviceId | string): string {
  return DEVICE_TO_PREFIX[deviceId as DeviceId] || ''
}
