export const Types = {
  Link: 'Link',
} as const

export const ControlDataTypeKey = '@@makeswift/type'

export type Options<T> =
  | T
  | ((props: Record<string, unknown>, deviceMode: Device) => T)

export type ResolveOptions<T extends Options<unknown>> = T extends Options<
  infer U
>
  ? U
  : never

export type Device = string

export type DeviceOverride<T> = { deviceId: Device; value: T }

export type ResponsiveValue<T> = DeviceOverride<T>[]

export type ResponsiveValueType<T> = T extends ResponsiveValue<infer U>
  ? U
  : never
