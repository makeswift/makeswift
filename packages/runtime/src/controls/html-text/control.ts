import {
  ControlInstance,
  type BoxDisplayModel,
  type ControlInstanceArgs,
} from '@makeswift/controls'

import deepEqual from '../../utils/deepEqual'

import {
  type HtmlTextFormat,
  type HtmlTextFormats,
  type HtmlTextLink,
  linkFromData,
  linkToData,
} from './formats'
import { type HtmlTextDefinition } from './html-text'

/** The editor that the panel changes: in content mode, or for the whole text. */
export type HtmlTextPanelEditor = {
  /** The formats of the selected text. */
  formats(): HtmlTextFormats
  /** Turns a format on or off for the selected text. */
  setFormat(format: HtmlTextFormat, on: boolean): void
  /** Sets the link of the selected text. `null` removes the link. */
  setLink(link: HtmlTextLink | null): void
}

/** The editor of the host element in content mode. */
export type HtmlTextEditorHandle = HtmlTextPanelEditor & {
  focus(): void
  /** Replaces the content, for a change that did not come from this editor. */
  setContent(html: string): void
}

const messagePrefix = 'makeswift::controls::unstable-html-text::control-message'

// COSMOS -> HOST
type FocusMessage = { type: typeof HtmlTextControl.FOCUS }
type ResetValueMessage = { type: typeof HtmlTextControl.RESET_VALUE }
type SetFormatMessage = {
  type: typeof HtmlTextControl.SET_FORMAT
  format: HtmlTextFormat
  on: boolean
}
type SetLinkMessage = {
  type: typeof HtmlTextControl.SET_LINK
  link: HtmlTextLink | null
}

// HOST -> COSMOS
type OnChangeMessage = { type: typeof HtmlTextControl.ON_CHANGE; value: string }
type FormatsChangeMessage = {
  type: typeof HtmlTextControl.FORMATS_CHANGE
  formats: HtmlTextFormats
}
type SelectMessage = { type: typeof HtmlTextControl.SELECT }
type SwitchToBuildModeMessage = { type: typeof HtmlTextControl.SWITCH_TO_BUILD_MODE }
type ChangeBoxModelMessage = {
  type: typeof HtmlTextControl.CHANGE_BOX_MODEL
  payload: { boxModel: BoxDisplayModel | null }
}
type UndoMessage = { type: typeof HtmlTextControl.UNDO }
type RedoMessage = { type: typeof HtmlTextControl.REDO }

type Message =
  | FocusMessage
  | ResetValueMessage
  | SetFormatMessage
  | SetLinkMessage
  | OnChangeMessage
  | FormatsChangeMessage
  | SelectMessage
  | SwitchToBuildModeMessage
  | ChangeBoxModelMessage
  | UndoMessage
  | RedoMessage

/**
 * The control of an `unstable_HtmlText` value. It connects the editor of the
 * host element and the builder: the builder panel sets the formats, and the
 * editor sends the new HTML.
 */
export class HtmlTextControl extends ControlInstance<Message> {
  // COSMOS -> HOST
  static readonly FOCUS = `${messagePrefix}::focus` as const
  static readonly RESET_VALUE = `${messagePrefix}::reset-value` as const
  static readonly SET_FORMAT = `${messagePrefix}::set-format` as const
  static readonly SET_LINK = `${messagePrefix}::set-link` as const

  // HOST -> COSMOS
  static readonly ON_CHANGE = `${messagePrefix}::on-change` as const
  static readonly FORMATS_CHANGE = `${messagePrefix}::formats-change` as const
  static readonly SELECT = `${messagePrefix}::select` as const
  static readonly SWITCH_TO_BUILD_MODE = `${messagePrefix}::switch-to-build-mode` as const
  static readonly CHANGE_BOX_MODEL = `${messagePrefix}::change-box-model` as const
  static readonly UNDO = `${messagePrefix}::undo` as const
  static readonly REDO = `${messagePrefix}::redo` as const

  /** The builder link panel uses Makeswift links. HTML uses an `href`. */
  static readonly linkToData = linkToData
  static readonly linkFromData = linkFromData

  private editor: HtmlTextEditorHandle | null = null
  /** The editor for the whole text, in build mode. */
  private wholeTextEditor: HtmlTextPanelEditor | null = null
  private pendingFocus = false
  /** The values that the editor sent, oldest first, until the builder echoes them. */
  private readonly sent: string[] = []
  private sentFormats: HtmlTextFormats | null = null

  constructor(
    private readonly descriptor: HtmlTextDefinition,
    args: ControlInstanceArgs<Message>,
  ) {
    super(args)
  }

  recv = (message: Message): void => {
    switch (message.type) {
      // The builder sends FOCUS when it enters content mode. The editor
      // mounts after that, so a FOCUS before the mount waits for it.
      case HtmlTextControl.FOCUS: {
        if (this.editor == null) this.pendingFocus = true
        else this.editor.focus()
        break
      }

      case HtmlTextControl.RESET_VALUE: {
        const { defaultValue } = this.descriptor.config
        this.setContent(defaultValue)
        this.onLocalUserChange(defaultValue)
        break
      }

      // A panel change. The editor change event saves the new HTML.
      case HtmlTextControl.SET_FORMAT: {
        this.panelEditor?.setFormat(message.format, message.on)
        break
      }

      case HtmlTextControl.SET_LINK: {
        this.panelEditor?.setLink(message.link)
        break
      }
    }
  }

  subscribe(_listener: () => void): () => void {
    return () => {}
  }

  isCompositeProp(): boolean {
    return false
  }

  children(): ControlInstance[] {
    return []
  }

  child(_key: string): ControlInstance | undefined {
    return undefined
  }

  // The value is an HTML string, which is also a React node. So the builder
  // applies an edit as a client override, and does not render the element on
  // the server again. The editor has already changed the element.
  resolvesToRenderableNode(): boolean {
    return true
  }

  /** The editor that the panel changes. The editor of content mode comes first. */
  private get panelEditor(): HtmlTextPanelEditor | null {
    return this.editor ?? this.wholeTextEditor
  }

  setEditor(editor: HtmlTextEditorHandle): void {
    this.editor = editor
    this.sent.length = 0

    if (this.pendingFocus) {
      this.pendingFocus = false
      editor.focus()
    }

    this.updateFormats()
  }

  /** The editor unmounted, because content mode ended. */
  releaseEditor(): void {
    this.editor = null
    this.pendingFocus = false
  }

  /** Sets the editor for the whole text, for the panel in build mode. */
  setWholeTextEditor(editor: HtmlTextPanelEditor | null): void {
    this.wholeTextEditor = editor
    this.updateFormats()
  }

  /** Sends the formats of the selected text to the panel, if they changed. */
  updateFormats(): void {
    const formats = this.panelEditor?.formats()
    if (formats == null || deepEqual(formats, this.sentFormats)) return

    this.sentFormats = formats
    this.sendMessage({ type: HtmlTextControl.FORMATS_CHANGE, formats })
  }

  /** The value of saved data: the HTML, or the default HTML. */
  resolveData(data: unknown): string {
    return this.descriptor.resolveValueFromData(typeof data === 'string' ? data : undefined)
  }

  /** Replaces the content of the editor, if it runs. */
  setContent(html: string): void {
    this.editor?.setContent(html)
  }

  onLocalUserChange(html: string): void {
    this.sent.push(html)
    this.sendMessage({ type: HtmlTextControl.ON_CHANGE, value: html })
  }

  /**
   * `true` if the value is the builder's echo of a value that this editor
   * sent. The builder echoes the values in order, so an echo also ends the
   * wait for each older value.
   */
  isEcho(html: string): boolean {
    const index = this.sent.indexOf(html)
    if (index === -1) return false

    this.sent.splice(0, index + 1)
    return true
  }

  select(): void {
    this.sendMessage({ type: HtmlTextControl.SELECT })
  }

  switchToBuildMode(): void {
    this.sendMessage({ type: HtmlTextControl.SWITCH_TO_BUILD_MODE })
  }

  undo(): void {
    this.sendMessage({ type: HtmlTextControl.UNDO })
  }

  redo(): void {
    this.sendMessage({ type: HtmlTextControl.REDO })
  }

  changeBoxModel(boxModel: BoxDisplayModel | null): void {
    this.sendMessage({ type: HtmlTextControl.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}
