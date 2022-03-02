import type { Device as DeviceID, DeviceOverride, ResponsiveValue } from '../../prop-controllers'

export type Device = {
  id: DeviceID
  minWidth?: number
  maxWidth?: number
}

export const DEVICES: Array<Device> = [
  { id: 'desktop', minWidth: 769 },
  { id: 'tablet', minWidth: 476, maxWidth: 768 },
  { id: 'mobile', maxWidth: 475 },
]

export const getDevice = (deviceId: DeviceID): Device => {
  const device = DEVICES.find(({ id }) => id === deviceId)

  if (device == null) throw new Error(`Unrecognized device ID: "${deviceId}".`)

  return device
}

export type FallbackStrategy<V> = (
  arg0: DeviceOverride<V> | undefined,
  arg1: ResponsiveValue<V>,
) => DeviceOverride<V> | undefined

function defaultStrategy<V>(
  value: DeviceOverride<V> | undefined,
  fallbacks: ResponsiveValue<V>,
): DeviceOverride<V> | undefined {
  return value || fallbacks[0]
}

export function findDeviceOverride<S>(
  values: ResponsiveValue<S> = [],
  deviceId: string,
  strategy: FallbackStrategy<S> = defaultStrategy,
): DeviceOverride<S> | undefined {
  const value = values.find(({ deviceId: d }) => d === deviceId)
  const fallbacks = DEVICES.slice(0, DEVICES.findIndex(d => d.id === deviceId) + 1)
    .reverse()
    .map(d => values.find(v => v.deviceId === d.id))
    .filter((override): override is DeviceOverride<S> => Boolean(override))

  return value != null || fallbacks.length > 0 ? strategy(value, fallbacks) : undefined
}

export type ExtractResponsiveValue<T> = T extends ResponsiveValue<infer V> ? V : never

export function join<V, A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>, R>(
  responsiveValues: A,
  joinFn: (values: { [I in keyof A]: ExtractResponsiveValue<A[I]> | undefined }) => R,
  strategy?: FallbackStrategy<V>,
): ResponsiveValue<R> {
  return DEVICES.map(({ id }) => id)
    .map(deviceId => {
      const value = joinFn(
        responsiveValues.map(responsiveValue => {
          const deviceValue =
            responsiveValue && findDeviceOverride(responsiveValue, deviceId, strategy)

          return deviceValue == null ? undefined : deviceValue.value
        }) as unknown as { [I in keyof A]: ExtractResponsiveValue<A[I] | undefined> },
      )

      if (value == null) return null

      return { deviceId, value }
    })
    .filter((override): override is DeviceOverride<R> => Boolean(override))
}

export const getDeviceMediaQuery = (device: Device): string => {
  const parts = ['@media only screen']

  if (device.minWidth != null) {
    parts.push(`(min-width: ${device.minWidth}px)`)
  }

  if (device.maxWidth != null) {
    parts.push(`(max-width: ${device.maxWidth}px)`)
  }

  return parts.join(' and ')
}
