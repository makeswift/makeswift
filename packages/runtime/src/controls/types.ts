export type Device = 'desktop' | 'tablet' | 'mobile'

export type DeviceOverride<T> = { deviceId: Device; value: T }

export type ResponsiveValue<T> = DeviceOverride<T>[]

export type ColorData = { swatchId: string; alpha: number }
