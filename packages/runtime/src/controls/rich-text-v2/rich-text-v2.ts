import { PropController } from '../../prop-controllers/base'
import { Descendant, Editor, Element } from 'slate'
import { BoxModel } from '../../box-model'
import { KeyboardEvent } from 'react'
import { Send } from '../../prop-controllers/instances'
import { ControlDefinition, ControlDefinitionData } from '../control'
import { RenderElementProps } from 'slate-react'

export type RichTextV2ControlData = Descendant[]

export const RichTextV2ControlType = 'makeswift::controls::rich-text-v2'

export const RichTextV2Mode = {
  Inline: 'makeswift::controls::rich-text-v2::mode::inline',
  Block: 'makeswift::controls::rich-text-v2::mode::block',
} as const

export type RichTextV2Mode = typeof RichTextV2Mode[keyof typeof RichTextV2Mode]

export type RichTextV2PluginControlValue<T extends ControlDefinition> =
  | ControlDefinitionData<T>
  | undefined

export type RichTextV2PluginControlDefinition<T extends ControlDefinition> = {
  definition: T
  getValue(editor: Editor): RichTextV2PluginControlValue<T>
  onChange(editor: Editor, value: RichTextV2PluginControlValue<T>): void
  getElementValue?(element: Element): any
}

export type RenderElement = (props: RenderElementProps) => JSX.Element

export type RichTextV2Plugin<T extends ControlDefinition = ControlDefinition> = {
  control?: RichTextV2PluginControlDefinition<T>
  withPlugin?(editor: Editor): Editor
  onKeyDown?(event: KeyboardEvent, editor: Editor): void
  renderElement?: (
    renderElement: RenderElement,
    value: any,
  ) => (props: RenderElementProps) => JSX.Element
}

export function createRichTextV2Plugin<T extends ControlDefinition>({
  control,
  withPlugin,
  onKeyDown,
  renderElement,
}: RichTextV2Plugin<T>) {
  return { control, withPlugin, onKeyDown, renderElement }
}

type RichTextV2Config = {
  plugins?: RichTextV2Plugin[]
  mode?: RichTextV2Mode
}

export type RichTextV2ControlDefinition<T extends RichTextV2Config = RichTextV2Config> = {
  type: typeof RichTextV2ControlType
  config: T
}

export function unstable_RichTextV2<T extends RichTextV2Config>(
  config: T = {} as T,
): RichTextV2ControlDefinition {
  return { type: RichTextV2ControlType, config }
}

export const RichTextV2ControlMessageType = {
  // COSMOS -> HOST
  RESET_VALUE: 'RESET_VALUE',
  FOCUS: 'FOCUS',
  RUN_PLUGIN_CONTROL_ACTION: 'RUN_PLUGIN_CONTROL_ACTION',

  // HOST -> COSMOS
  SET_DEFAULT_VALUE: 'SET_DEFAULT_VALUE',
  SET_PLUGIN_CONTROL_VALUE: 'SET_PLUGIN_CONTROL_VALUE',
  ON_CHANGE: 'ON_CHANGE',
  SELECT: 'SELECT',
  SWITCH_TO_BUILD_MODE: 'SWITCH_TO_BUILD_MODE',
  CHANGE_BOX_MODEL: 'CHANGE_BOX_MODEL',
} as const

type OnChangeRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.ON_CHANGE
  value: RichTextV2ControlData
}

type SetDefaultValueRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SET_DEFAULT_VALUE
  value: RichTextV2ControlData
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

export class RichTextV2Control<
  T extends RichTextV2ControlDefinition = RichTextV2ControlDefinition,
> extends PropController<RichTextV2ControlMessage> {
  private editor: Editor | null = null
  private defaultValue: RichTextV2ControlData | null = null
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
          this.editor.selection = null
          this.editor.children = this.defaultValue
          this.editor.onChange()
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
  }

  setDefaultValue(defaultValue: RichTextV2ControlData) {
    this.defaultValue = defaultValue
    this.send({ type: RichTextV2ControlMessageType.SET_DEFAULT_VALUE, value: defaultValue })
  }

  select() {
    this.send({ type: RichTextV2ControlMessageType.SELECT })
  }

  switchToBuildMode() {
    this.send({ type: RichTextV2ControlMessageType.SWITCH_TO_BUILD_MODE })
  }

  onChange(value: Descendant[]) {
    const editor = this.editor
    if (editor == null) return

    this.send({
      type: RichTextV2ControlMessageType.ON_CHANGE,
      value,
    })

    this.send({
      type: RichTextV2ControlMessageType.SET_PLUGIN_CONTROL_VALUE,
      value:
        this.descriptor.config?.plugins?.map(plugin => plugin?.control?.getValue(editor)) ?? [],
    })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: RichTextV2ControlMessageType.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}
