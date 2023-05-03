import { BuilderEditMode } from '../../state/modules/builder-edit-mode'
import { PropController, Send } from '../../prop-controllers/instances'
import { BoxModel } from '../../box-model'
import { RichTextDTO } from './dto-types'
import { Editor, Transforms } from 'slate'
import { richTextDAOToDTO } from './translation'
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'
import { Descriptor } from '../../prop-controllers/descriptors'
import { MouseEvent, ReactNode, KeyboardEvent } from 'react'
import { HistoryEditor } from 'slate-history'

export type RichTextControlDataV2 = RichTextDTO

export const RichTextControlTypeV2 = 'makeswift::controls::rich-text-v2'

export const RichTextMode = {
  Inline: 'makeswift::controls::rich-text-v2::mode::inline',
  Block: 'makeswift::controls::rich-text-v2::mode::block',
} as const

type RichTextMode = typeof RichTextMode[keyof typeof RichTextMode]

type RichTextV2PluginControlDefinition<T extends Descriptor> = {
  definition: T
  getValue(editor: Editor): T // ControlDefinitionValue<T>
  onChange(editor: Editor, value: T): void
}

type RichTextV2PluginEditableProps = {
  onKeyDown?(event: KeyboardEvent): void
  onClick?(event: MouseEvent): void
  renderLeaf?(props: RenderLeafProps): ReactNode
  renderElement?(props: RenderElementProps): ReactNode
}

export type RichTextV2Plugin<T extends Descriptor> = {
  controls?: RichTextV2PluginControlDefinition<T>[]
  editableProps?: RichTextV2PluginEditableProps
  withPlugin?(editor: Editor): Editor
}

type RichTextControlConfigV2 = {
  plugins?: RichTextV2Plugin<any>[]
}

export type RichTextControlDefinitionV2<
  T extends RichTextControlConfigV2 = RichTextControlConfigV2,
> = {
  type: typeof RichTextControlTypeV2
  config: T
}

export function RichTextV2<T extends RichTextControlConfigV2>(
  config: T = {} as T,
): RichTextControlDefinitionV2<T> {
  return { type: RichTextControlTypeV2, config }
}

export const RichTextControlMessageTypeV2 = {
  CHANGE_BUILDER_EDIT_MODE: 'CHANGE_BUILDER_EDIT_MODE',
  INITIALIZE_EDITOR: 'INITIALIZE_EDITOR',
  CHANGE_EDITOR_VALUE: 'CHANGE_EDITOR_VALUE',
  FOCUS: 'FOCUS',
  BLUR: 'BLUR',
  UNDO: 'UNDO',
  REDO: 'REDO',
  CHANGE_BOX_MODEL: 'CHANGE_BOX_MODEL',
  UPDATE_PANEL: 'UPDATE_PANEL',
  RUN_ACTION: 'RUN_ACTION',
} as const

type ChangeBuilderEditModeRichTextControlMessage = {
  type: typeof RichTextControlMessageTypeV2.CHANGE_BUILDER_EDIT_MODE
  editMode: BuilderEditMode
}

type InitializeEditorRichTextControlMessage = {
  type: typeof RichTextControlMessageTypeV2.INITIALIZE_EDITOR
  value: RichTextDTO
}

type ChangeEditorValueRichTextControlMessage = {
  type: typeof RichTextControlMessageTypeV2.CHANGE_EDITOR_VALUE
  value: RichTextDTO
}

type FocusRichTextControlMessage = { type: typeof RichTextControlMessageTypeV2.FOCUS }

type BlurRichTextControlMessage = { type: typeof RichTextControlMessageTypeV2.BLUR }

type UndoRichTextControlMessage = { type: typeof RichTextControlMessageTypeV2.UNDO }

type RedoRichTextControlMessage = { type: typeof RichTextControlMessageTypeV2.REDO }

type BoxModelChangeRichControlMessage = {
  type: typeof RichTextControlMessageTypeV2.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

type UpdatePanelRichTextControlMessage = {
  type: typeof RichTextControlMessageTypeV2.UPDATE_PANEL
  values: any[]
}

type RunActionRichTextControlMessage = {
  type: typeof RichTextControlMessageTypeV2.RUN_ACTION
  index: number
  value: unknown
}

export type RichTextControlMessageV2 =
  | ChangeBuilderEditModeRichTextControlMessage
  | InitializeEditorRichTextControlMessage
  | ChangeEditorValueRichTextControlMessage
  | FocusRichTextControlMessage
  | BlurRichTextControlMessage
  | UndoRichTextControlMessage
  | RedoRichTextControlMessage
  | BoxModelChangeRichControlMessage
  | UpdatePanelRichTextControlMessage
  | RunActionRichTextControlMessage

export class RichTextControlV2<
  T extends RichTextControlDefinitionV2 = RichTextControlDefinitionV2,
> extends PropController<RichTextControlMessageV2> {
  private editor: Editor | null = null
  controls: any[][]
  descriptor: RichTextControlDefinitionV2

  constructor(send: Send<RichTextControlMessageV2>, descriptor: T) {
    super(send)

    this.descriptor = descriptor
    this.send = send

    this.controls = []
  }

  recv = (message: RichTextControlMessageV2): void => {
    if (!this.editor) return
    switch (message.type) {
      case RichTextControlMessageTypeV2.FOCUS: {
        this.focus()
        break
      }
      case RichTextControlMessageTypeV2.RUN_ACTION: {
        this.descriptor.config.plugins
          ?.at(message.index)
          ?.controls?.map(control => this.editor && control.onChange(this.editor, message.value))
      }
    }
  }

  setSlateEditor(editor: Editor) {
    this.editor = editor

    this.send({
      type: RichTextControlMessageTypeV2.INITIALIZE_EDITOR,
      value: richTextDAOToDTO(editor.children, editor.selection),
    })

    this.send({
      type: RichTextControlMessageTypeV2.UPDATE_PANEL,
      values:
        this.descriptor.config.plugins?.map(plugin =>
          plugin.controls?.map(control => control.getValue(editor) ?? []),
        ) ?? [],
    })

    const _onChange = editor.onChange
    this.editor.onChange = options => {
      _onChange(options)
      this.send({
        type: RichTextControlMessageTypeV2.CHANGE_EDITOR_VALUE,
        value: richTextDAOToDTO(editor.children, editor.selection),
      })

      this.send({
        type: RichTextControlMessageTypeV2.UPDATE_PANEL,
        values:
          this.descriptor.config.plugins?.map(plugin =>
            plugin.controls?.map(control => control.getValue(editor) ?? []),
          ) ?? [],
      })
    }
  }

  focus() {
    if (this.editor == null) return
    ReactEditor.focus(this.editor)
    if (this.editor.selection == null) {
      Transforms.select(this.editor, {
        anchor: Editor.start(this.editor, []),
        focus: Editor.end(this.editor, []),
      })
    }
    this.send({ type: RichTextControlMessageTypeV2.FOCUS })
  }

  blur() {
    if (this.editor == null) return
    ReactEditor.deselect(this.editor)
    console.log(this.editor.selection)

    ReactEditor.blur(this.editor)
    this.send({ type: RichTextControlMessageTypeV2.BLUR })
  }

  undo() {
    if (this.editor == null) return
    HistoryEditor.undo(this.editor)
  }

  redo() {
    if (this.editor == null) return
    HistoryEditor.redo(this.editor)
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: RichTextControlMessageTypeV2.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}
