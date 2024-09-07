import { z } from 'zod'

import * as Schema from './schema'

export { type BoxModel } from 'css-box-model'

export type Data = z.infer<typeof Schema.data>
export type Device = z.infer<typeof Schema.deviceId>
export type DeviceOverride<T> = { deviceId: Device; value: T }
export type ResponsiveValue<T> = DeviceOverride<T>[]
export type ResponsiveValueType<T> =
  T extends ResponsiveValue<infer U> ? U : never

export type ElementData = z.infer<typeof Schema.elementData>
export type ElementReference = z.infer<typeof Schema.elementReference>
export type Element = z.infer<typeof Schema.element>

export function isElementReference(
  element: Element,
): element is ElementReference {
  return !('props' in element)
}

export const ControlDataTypeKey = '@@makeswift/type'
