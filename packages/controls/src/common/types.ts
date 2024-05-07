export type Device = string

export type DeviceOverride<T> = { deviceId: Device; value: T }

export type ResponsiveValue<T> = DeviceOverride<T>[]

export type ColorData = { swatchId: string; alpha: number }

export type Data = undefined | null | boolean | number | string | Data[] | { [key: string]: Data }
