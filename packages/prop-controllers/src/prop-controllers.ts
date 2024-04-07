export const Types = {
  Link: 'Link',
  Shadows: 'Shadows',
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

type Data =
  | undefined
  | null
  | boolean
  | number
  | string
  | Data[]
  | { [key: string]: Data }

export type ElementData = {
  type: string
  key: string
  props: Record<string, Data>
}

type ElementReference = { type: 'reference'; key: string; value: string }

type Element = ElementData | ElementReference

export type ReplacementContext = {
  elementHtmlIds: Set<string>
  elementKeys: Map<string, string>
  swatchIds: Map<string, string>
  fileIds: Map<string, string>
  typographyIds: Map<string, string>
  tableIds: Map<string, string>
  tableColumnIds: Map<string, string>
  pageIds: Map<string, string>
  globalElementIds: Map<string, string>
  globalElementData: Map<string, ElementData>
}

export type CopyContext = {
  replacementContext: ReplacementContext
  copyElement: (node: Element) => Element
}
