import { Editor, Element, Text } from 'slate'

import { ControlDefinition, type DataType } from '../../control-definition'

export type RichTextPluginControl<
  Def extends ControlDefinition = ControlDefinition,
  ValueType = any,
> = {
  definition: Def
  getValue(editor: Editor): ValueType | undefined
  onChange(editor: Editor, value: ValueType): void
  getElementValue?(element: Element): DataType<Def> | undefined
  getLeafValue?(leaf: Text): DataType<Def> | undefined
}

export type PluginControlDefinitionType<Plugin> =
  Plugin extends RichTextPluginControl<infer Def, any> ? Def : never

export type PluginControlValueType<Plugin> =
  Plugin extends RichTextPluginControl<any, infer ValueType> ? ValueType : never
