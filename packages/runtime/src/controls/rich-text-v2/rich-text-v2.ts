import { PropController } from '../../prop-controllers/base'
import { Descendant, Editor, Element, Text } from 'slate'
import { BoxModel } from '../../box-model'
import { KeyboardEvent } from 'react'
import { Send } from '../../prop-controllers/instances'
import { ControlDefinition, ControlDefinitionData } from '../control'
import { RenderElementProps, RenderLeafProps } from 'slate-react'
import { RichTextControlData } from '../rich-text/rich-text'
import { richTextV2DescendentsToData } from './translation'
import mitt from 'mitt'

export const RichTextV2ControlType = 'makeswift::controls::rich-text-v2'

export type RichTextV2ControlData = {
  version: 2
  type: typeof RichTextV2ControlType
  descendants: Descendant[]
}

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
  RESET_VALUE: 'makeswift::controls::rich-text-v2::control-message::reset-value',
  FOCUS: 'makeswift::controls::rich-text-v2::control-message::focus',
  RUN_PLUGIN_CONTROL_ACTION:
    'makeswift::controls::rich-text-v2::control-message::run-plugin-control-action',

  // HOST -> COSMOS
  SET_DEFAULT_VALUE: 'makeswift::controls::rich-text-v2::control-message::set-default-value',
  SET_VALUE_FROM_PROP: 'makeswift::controls::rich-text-v2::control-message::set-value-from-prop',
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
  value: RichTextV2ControlData
}

type SetPluginControlValueRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SET_PLUGIN_CONTROL_VALUE
  value: RichTextV2PluginControlValue<ControlDefinition>[]
}

type ResetValueRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.RESET_VALUE }
type SetValueFromPropRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SET_VALUE_FROM_PROP
}

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
  | SetValueFromPropRichTextControlMessage
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
  private defaultValue: RichTextV2ControlData | null = null
  descriptor: RichTextV2ControlDefinition
  emitter = mitt()

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
          this.editor.children = this.defaultValue.descendants
          this.editor.onChange()
        }
        break
      }
      case RichTextV2ControlMessageType.SET_VALUE_FROM_PROP: {
        console.log('SET_VALUE_FROM_PROP')

        this.emitter.emit(RichTextV2ControlMessageType.SET_VALUE_FROM_PROP)
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

  setDefaultValue(defaultValue: Descendant[]) {
    this.defaultValue = richTextV2DescendentsToData(defaultValue)
    this.send({
      type: RichTextV2ControlMessageType.SET_DEFAULT_VALUE,
      value: richTextV2DescendentsToData(defaultValue),
    })
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
      value: richTextV2DescendentsToData(value),
    })

    this.send({
      type: RichTextV2ControlMessageType.SET_PLUGIN_CONTROL_VALUE,
      value:
        this.descriptor.config?.plugins?.map(plugin => plugin?.control?.getValue(editor)) ?? [],
    })
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
    value !== undefined && typeof value === 'object' && !Array.isArray(value) && 'object' in value
  )
}
