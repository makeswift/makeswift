import { type Editor, type Element, type Text } from 'slate'

import { type Data } from '../../../common'
import { type DataType } from '../../associated-types'
import { ControlDefinition } from '../../definition'

export type RichTextPluginControl<
  Def extends ControlDefinition = ControlDefinition,
  ValueType extends Data = Data,
> = {
  definition: Def
  getValue?(editor: Editor): ValueType | undefined
  onChange?(editor: Editor, value: ValueType): void
  getElementValue?(element: Element): DataType<Def> | undefined
  getLeafValue?(leaf: Text): DataType<Def> | undefined
}

export type PluginControlDefinitionType<Plugin> =
  Plugin extends RichTextPluginControl<infer Def, any> ? Def : never

export type PluginControlValueType<Plugin> =
  Plugin extends RichTextPluginControl<any, infer ValueType> ? ValueType : never
