import { Data, DescriptorValueType, PanelDescriptor } from './descriptors'

export const DELETED_PROP_CONTROLLER_TYPES = {
  List: 'List',
  Shape: 'Shape',
  Typeahead: 'Typeahead',
} as const

export type DeletedPropControllerDescriptor<T extends Data = Data> =
  | ListDescriptor<T extends ListValue ? T : ListValue>
  | ShapeDescriptor<T extends ShapeValue ? T : ShapeValue, any>
  | TypeaheadDescriptor<T extends TypeaheadValue ? T : TypeaheadValue>

type ListValueItem<T extends Data> = { id: string; value?: T }

export type ListValue<T extends Data = Data> = ListValueItem<T>[]

export type ListOptions<T extends Data> = {
  type: PanelDescriptor<T>
  label?: string
  getItemLabel?: ((value: T | undefined) => string) | ((value: T | undefined) => Promise<string>)
  preset?: ListValue<T>
  defaultValue?: ListValue<T>
}

export type ListDescriptor<T extends ListValue = ListValue> = {
  type: typeof DELETED_PROP_CONTROLLER_TYPES.List
  options: ListOptions<T extends ListValue<infer U> ? U : never>
}

export type ShapeValue<T extends Data = Data> = Record<string, T>

type ShapeOptions<T extends Record<string, PanelDescriptor>> = {
  type: T
  preset?: { [K in keyof T]?: DescriptorValueType<T[K]> }
}

export type ShapeDescriptor<
  _T extends Record<string, Data>,
  U extends Record<string, PanelDescriptor>,
> = {
  type: typeof DELETED_PROP_CONTROLLER_TYPES.Shape
  options: ShapeOptions<U>
}

export type TypeaheadValue<T extends Data = Data> = {
  id: string
  label: string
  value: T
}

export type TypeaheadOptions<T extends Data> = {
  getItems: (query: string) => Promise<TypeaheadValue<T>[]>
  label?: string
  preset?: TypeaheadValue<T>
  defaultValue?: TypeaheadValue<T>
}

export type TypeaheadDescriptor<T extends TypeaheadValue = TypeaheadValue> = {
  type: typeof DELETED_PROP_CONTROLLER_TYPES.Typeahead
  options: TypeaheadOptions<T extends TypeaheadValue<infer U> ? U : never>
}
