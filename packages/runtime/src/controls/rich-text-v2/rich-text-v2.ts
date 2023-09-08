// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import { PropController } from '../../prop-controllers/base'
import { Descendant, Editor } from 'slate'
import { BoxModel } from '../../box-model'
import { Send } from '../../prop-controllers/instances'
import { ControlDefinition } from '../control'
import { RichTextControlData } from '../rich-text/rich-text'
import { richTextV2DescendentsToData } from './dto'
import { LinkPlugin } from '../../slate/LinkPlugin/linkPluginWithoutRenderElement'
import { InlinePlugin } from '../../slate/InlinePlugin'
import { TextAlignPlugin } from '../../slate/TextAlignPlugin'
import { BlockPlugin } from '../../slate/BlockPlugin'
import { TypographyPlugin } from '../../slate/TypographyPlugin'
import { InlineModePlugin } from '../../slate/InlineModePlugin'
import { RichTextV2Plugin, RichTextV2PluginControlValue } from './plugin'

export const RichTextV2ControlType = 'makeswift::controls::rich-text-v2'

export type RichTextV2ControlData = {
  version: 2
  type: typeof RichTextV2ControlType
  descendants: Descendant[]
  key: string
}

export const RichTextV2Mode = {
  Inline: 'makeswift::controls::rich-text-v2::mode::inline',
  Block: 'makeswift::controls::rich-text-v2::mode::block',
} as const

export type RichTextV2Mode = typeof RichTextV2Mode[keyof typeof RichTextV2Mode]

export type RichTextMode = RichTextV2Mode

export type RichTextV2Config = {
  mode?: RichTextV2Mode
  plugins?: RichTextV2Plugin[]
  defaultValue?: string
}

type ExternalRichTextV2Config = Omit<RichTextV2Config, 'plugins' | 'defaultValue'>

export type RichTextV2ControlDefinition<T extends RichTextV2Config = RichTextV2Config> = {
  type: typeof RichTextV2ControlType
  config: T
}

export function RichText<T extends ExternalRichTextV2Config>(
  config: T = {} as T,
): RichTextV2ControlDefinition {
  return {
    type: RichTextV2ControlType,
    config: {
      mode: config.mode,
      defaultValue: config?.mode === RichTextV2Mode.Inline ? 'Edit this text' : ipsum(3),
      plugins:
        config?.mode === RichTextV2Mode.Inline
          ? [InlineModePlugin()]
          : // Note: this plugin references a `renderElement`-less LinkPlugin to prevent a circular dependency
            [BlockPlugin(), TypographyPlugin(), TextAlignPlugin(), InlinePlugin(), LinkPlugin()],
    },
  }
}

RichText.Mode = RichTextV2Mode

export const RichTextV2ControlMessageType = {
  // COSMOS -> HOST
  RESET_VALUE: 'makeswift::controls::rich-text-v2::control-message::reset-value',
  FOCUS: 'makeswift::controls::rich-text-v2::control-message::focus',
  RUN_PLUGIN_CONTROL_ACTION:
    'makeswift::controls::rich-text-v2::control-message::run-plugin-control-action',

  // HOST -> COSMOS
  SET_DEFAULT_VALUE: 'makeswift::controls::rich-text-v2::control-message::set-default-value',
  SET_PLUGIN_CONTROL_VALUE:
    'makeswift::controls::rich-text-v2::control-message::set-plugin-control-value',
  ON_CHANGE: 'makeswift::controls::rich-text-v2::control-message::on-change',
  SELECT: 'makeswift::controls::rich-text-v2::control-message::select',
  SWITCH_TO_BUILD_MODE: 'makeswift::controls::rich-text-v2::control-message::switch-to-build-mode',
  CHANGE_BOX_MODEL: 'makeswift::controls::rich-text-v2::control-message::change-box-model',

  REDO: 'makeswift::controls::rich-text-v2::control-message::redo',
  UNDO: 'makeswift::controls::rich-text-v2::control-message::undo',
} as const

type OnChangeRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.ON_CHANGE
  value: RichTextV2ControlData
}

type SetDefaultValueRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SET_DEFAULT_VALUE
  value: Descendant[]
}

type SetPluginControlValueRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SET_PLUGIN_CONTROL_VALUE
  value: RichTextV2PluginControlValue<ControlDefinition>[]
}

type ResetValueRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.RESET_VALUE }

type SelectRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.SELECT }

type RunPluginControlActionRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.RUN_PLUGIN_CONTROL_ACTION
  pluginIndex: number
  value: RichTextV2PluginControlValue<ControlDefinition>
}

type FocusRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.FOCUS }

type SwitchToBuildModeRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SWITCH_TO_BUILD_MODE
}

type BoxModelChangeRichControlMessage = {
  type: typeof RichTextV2ControlMessageType.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

type UndoRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.UNDO }

type RedoRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.REDO }

export type RichTextV2ControlMessage =
  | OnChangeRichTextControlMessage
  | SetDefaultValueRichTextControlMessage
  | SetPluginControlValueRichTextControlMessage
  | ResetValueRichTextControlMessage
  | FocusRichTextControlMessage
  | RunPluginControlActionRichTextControlMessage
  | SelectRichTextControlMessage
  | SwitchToBuildModeRichTextControlMessage
  | BoxModelChangeRichControlMessage
  | UndoRichTextControlMessage
  | RedoRichTextControlMessage

export class RichTextV2Control<
  T extends RichTextV2ControlDefinition = RichTextV2ControlDefinition,
> extends PropController<RichTextV2ControlMessage> {
  private editor: Editor | null = null
  private defaultValue: Descendant[] | null = null
  descriptor: RichTextV2ControlDefinition

  constructor(send: Send<RichTextV2ControlMessage>, descriptor: T) {
    super(send)

    this.descriptor = descriptor
    this.send = send
  }

  recv = (message: RichTextV2ControlMessage): void => {
    if (!this.editor) return
    switch (message.type) {
      case RichTextV2ControlMessageType.FOCUS: {
        this.editor.focusAndSelectAll()
        break
      }
      case RichTextV2ControlMessageType.RESET_VALUE: {
        if (this.defaultValue) {
          this.editor.resetValue(this.defaultValue)
          setTimeout(() => {
            this.onLocalUserChange()
          })
        }
        break
      }
      case RichTextV2ControlMessageType.RUN_PLUGIN_CONTROL_ACTION: {
        this.descriptor.config.plugins
          ?.at(message.pluginIndex)
          ?.control?.onChange(this.editor, message.value)
        break
      }
    }
  }

  setEditor(editor: Editor) {
    this.editor = editor
    this.send({
      type: RichTextV2ControlMessageType.SET_PLUGIN_CONTROL_VALUE,
      value:
        this.descriptor.config?.plugins?.map(plugin => plugin?.control?.getValue(editor)) ?? [],
    })

    const _onChange = editor.onChange
    this.editor.onChange = options => {
      _onChange(options)
      this.updatePluginValues()
      if (this.editor == null || options?.operation == null) return
      this.onLocalUserChange()
    }
  }

  setDefaultValue(defaultValue: Descendant[]) {
    this.defaultValue = defaultValue
    this.send({
      type: RichTextV2ControlMessageType.SET_DEFAULT_VALUE,
      value: defaultValue,
    })
  }

  onLocalUserChange() {
    if (this.editor == null) return
    this.send({
      type: RichTextV2ControlMessageType.ON_CHANGE,
      value: richTextV2DescendentsToData(this.editor.children, this.editor.currentKey),
    })
  }

  updatePluginValues() {
    const editor = this.editor
    if (editor == null) return
    this.send({
      type: RichTextV2ControlMessageType.SET_PLUGIN_CONTROL_VALUE,
      value:
        this.descriptor.config?.plugins?.map(plugin => plugin?.control?.getValue(editor)) ?? [],
    })
  }

  select() {
    this.send({ type: RichTextV2ControlMessageType.SELECT })
  }

  switchToBuildMode() {
    this.send({ type: RichTextV2ControlMessageType.SWITCH_TO_BUILD_MODE })
  }

  undo() {
    this.send({ type: RichTextV2ControlMessageType.UNDO })
  }

  redo() {
    this.send({ type: RichTextV2ControlMessageType.REDO })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: RichTextV2ControlMessageType.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}

export function isRichTextV1Data(
  value: RichTextControlData | RichTextV2ControlData | undefined,
): value is RichTextControlData {
  return (
    value !== undefined && typeof value === 'object' && !Array.isArray(value) && 'document' in value
  )
}
