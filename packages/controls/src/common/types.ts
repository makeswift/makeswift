import { z } from 'zod'

export { type BoxModel } from 'css-box-model'

import * as schema from './schema'

export type Data = z.infer<typeof schema.data>
export type ColorData = z.infer<typeof schema.colorData>
export type ResolvedColorData = z.infer<typeof schema.resolvedColorData>
export type Device = z.infer<typeof schema.deviceId>
export type DeviceOverride<T> = { deviceId: Device; value: T }
export type ResponsiveValue<T> = DeviceOverride<T>[]
export type ResponsiveValueType<T> =
  T extends ResponsiveValue<infer U> ? U : never

export type ElementData = z.infer<typeof schema.elementData>
export type ElementReference = z.infer<typeof schema.elementReference>
export type Element = z.infer<typeof schema.element>

export function isElementReference(
  element: Element,
): element is ElementReference {
  return !('props' in element)
}

export const ControlDataTypeKey = '@@makeswift/type'
