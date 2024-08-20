import { type KeyboardEvent } from 'react'
import { type Editor } from 'slate'
import { type RenderElementProps, type RenderLeafProps } from 'slate-react'
import { ControlDefinition, type Data, type RichTextPluginControl } from '@makeswift/controls'

export type RenderElement = (props: RenderElementProps) => JSX.Element
export type RenderLeaf = (props: RenderLeafProps) => JSX.Element

export type RichTextV2Plugin<C extends RichTextPluginControl = RichTextPluginControl> = {
  control?: C
  withPlugin?(editor: Editor): Editor
  onKeyDown?(event: KeyboardEvent, editor: Editor): void
  renderElement?: (
    renderElement: RenderElement,
    value: any,
  ) => (props: RenderElementProps) => JSX.Element
  renderLeaf?: (renderLeaf: RenderLeaf, value: any) => (props: RenderLeafProps) => JSX.Element
}

export function Plugin<Def extends ControlDefinition, ValueType extends Data>({
  control,
  withPlugin,
  onKeyDown,
  renderElement,
  renderLeaf,
}: RichTextV2Plugin<RichTextPluginControl<Def, ValueType>>) {
  return { control, withPlugin, onKeyDown, renderElement, renderLeaf }
}
