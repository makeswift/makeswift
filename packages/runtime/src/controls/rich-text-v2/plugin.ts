import { Editor, Element, Text } from 'slate'
import { ControlDefinition, ControlDefinitionData } from '../control'
import { RenderElementProps, RenderLeafProps } from 'slate-react'
import { KeyboardEvent } from 'react'

export type RichTextV2PluginControlValue<T extends ControlDefinition> =
  | ControlDefinitionData<T>
  | undefined

export type RichTextV2PluginControlDefinition<T extends ControlDefinition> = {
  definition: T
  getValue(editor: Editor): RichTextV2PluginControlValue<T>
  onChange(editor: Editor, value: RichTextV2PluginControlValue<T>): void
  getElementValue?(element: Element): any
  getLeafValue?(leaf: Text): any
}

export type RenderElement = (props: RenderElementProps) => JSX.Element
export type RenderLeaf = (props: RenderLeafProps) => JSX.Element

export type RichTextV2Plugin<T extends ControlDefinition = ControlDefinition> = {
  control?: RichTextV2PluginControlDefinition<T>
  withPlugin?(editor: Editor): Editor
  onKeyDown?(event: KeyboardEvent, editor: Editor): void
  renderElement?: (
    renderElement: RenderElement,
    value: any,
  ) => (props: RenderElementProps) => JSX.Element
  renderLeaf?: (renderLeaf: RenderLeaf, value: any) => (props: RenderLeafProps) => JSX.Element
}

export function createRichTextV2Plugin<T extends ControlDefinition>({
  control,
  withPlugin,
  onKeyDown,
  renderElement,
  renderLeaf,
}: RichTextV2Plugin<T>) {
  return { control, withPlugin, onKeyDown, renderElement, renderLeaf }
}
