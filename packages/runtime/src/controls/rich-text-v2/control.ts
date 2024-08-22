import { Editor } from 'slate'
// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import {
  RichTextDefinition,
  ControlInstance,
  Slate,
  type DataType,
  type SendMessage,
  type Data,
} from '@makeswift/controls'

import { BoxModel } from '../../box-model'

import { RichTextV2Definition } from './rich-text-v2'

// COSMOS -> HOST
type ResetValueMessage = { type: typeof RichTextV2Control.RESET_VALUE }
type FocusMessage = { type: typeof RichTextV2Control.FOCUS }
type RunPluginControlActionMessage = {
  type: typeof RichTextV2Control.RUN_PLUGIN_CONTROL_ACTION
  pluginIndex: number
  value: Data
}

// HOST -> COSMOS
type SetDefaultValueMessage = {
  type: typeof RichTextV2Control.SET_DEFAULT_VALUE
  value: Slate.Descendant[]
}

type SetPluginControlValueMessage = {
  type: typeof RichTextV2Control.SET_PLUGIN_CONTROL_VALUE
  value: Data[]
}

type OnChangeMessage = {
  type: typeof RichTextV2Control.ON_CHANGE
  value: DataType<RichTextV2Definition>
}

type SelectMessage = { type: typeof RichTextV2Control.SELECT }

type SwitchToBuildModeMessage = {
  type: typeof RichTextV2Control.SWITCH_TO_BUILD_MODE
}

type ChangeBoxModelMessage = {
  type: typeof RichTextV2Control.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

type UndoMessage = { type: typeof RichTextV2Control.UNDO }
type RedoMessage = { type: typeof RichTextV2Control.REDO }

type Message =
  | ResetValueMessage
  | FocusMessage
  | RunPluginControlActionMessage
  | SetDefaultValueMessage
  | SetPluginControlValueMessage
  | OnChangeMessage
  | SelectMessage
  | SwitchToBuildModeMessage
  | ChangeBoxModelMessage
  | UndoMessage
  | RedoMessage

export class RichTextV2Control extends ControlInstance<Message> {
  private static readonly messagePrefix = `${RichTextDefinition.type}::control-message` as const

  // COSMOS -> HOST
  static readonly RESET_VALUE = `${this.messagePrefix}::reset-value` as const
  static readonly FOCUS = `${this.messagePrefix}::focus` as const
  static readonly RUN_PLUGIN_CONTROL_ACTION =
    `${this.messagePrefix}::run-plugin-control-action` as const

  // HOST -> COSMOS
  static readonly SET_DEFAULT_VALUE = `${this.messagePrefix}::set-default-value` as const
  static readonly SET_PLUGIN_CONTROL_VALUE =
    `${this.messagePrefix}::set-plugin-control-value` as const
  static readonly ON_CHANGE = `${this.messagePrefix}::on-change` as const
  static readonly SELECT = `${this.messagePrefix}::select` as const
  static readonly SWITCH_TO_BUILD_MODE = `${this.messagePrefix}::switch-to-build-mode` as const
  static readonly CHANGE_BOX_MODEL = `${this.messagePrefix}::change-box-model` as const

  static readonly REDO = `${this.messagePrefix}::redo` as const
  static readonly UNDO = `${this.messagePrefix}::undo` as const

  private editor: Editor | null = null
  private defaultValue: Slate.Descendant[] | null = null

  constructor(
    send: SendMessage<Message>,
    private readonly descriptor: RichTextV2Definition,
  ) {
    super(send)
  }

  recv = (message: Message): void => {
    if (!this.editor) return

    switch (message.type) {
      case RichTextV2Control.FOCUS: {
        this.editor.focusAndSelectAll()
        break
      }

      case RichTextV2Control.RESET_VALUE: {
        if (this.defaultValue) {
          this.editor.resetValue(this.defaultValue)
          setTimeout(() => {
            this.onLocalUserChange()
          })
        }
        break
      }

      case RichTextV2Control.RUN_PLUGIN_CONTROL_ACTION: {
        this.descriptor.pluginControlAt(message.pluginIndex)?.onChange?.(this.editor, message.value)
        break
      }
    }
  }

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  setEditor(editor: Editor) {
    this.editor = editor
    this.sendMessage({
      type: RichTextV2Control.SET_PLUGIN_CONTROL_VALUE,
      value: this.getValue(editor),
    })

    const _onChange = editor.onChange
    this.editor.onChange = options => {
      _onChange(options)
      this.updatePluginValues()
      if (this.editor == null || options?.operation == null) return
      this.onLocalUserChange()
    }
  }

  setDefaultValue(defaultValue: Slate.Descendant[]) {
    this.defaultValue = defaultValue
    this.sendMessage({
      type: RichTextV2Control.SET_DEFAULT_VALUE,
      value: defaultValue,
    })
  }

  onLocalUserChange() {
    if (this.editor == null) return

    this.sendMessage({
      type: RichTextV2Control.ON_CHANGE,
      value: RichTextV2Definition.nodesToDataV2(this.editor.children, this.editor.currentKey),
    })
  }

  updatePluginValues() {
    const editor = this.editor
    if (editor == null) return

    this.sendMessage({
      type: RichTextV2Control.SET_PLUGIN_CONTROL_VALUE,
      value: this.getValue(editor),
    })
  }

  getValue(editor: Editor) {
    return this.descriptor.pluginControls.map(control => control.getValue?.(editor)) ?? []
  }

  select() {
    this.sendMessage({ type: RichTextV2Control.SELECT })
  }

  switchToBuildMode() {
    this.sendMessage({ type: RichTextV2Control.SWITCH_TO_BUILD_MODE })
  }

  undo() {
    this.sendMessage({ type: RichTextV2Control.UNDO })
  }

  redo() {
    this.sendMessage({ type: RichTextV2Control.REDO })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.sendMessage({
      type: RichTextV2Control.CHANGE_BOX_MODEL,
      payload: { boxModel },
    })
  }
}
