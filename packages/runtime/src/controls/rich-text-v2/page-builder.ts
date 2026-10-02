import { type Editor } from 'slate'
import {
  type CopyContext,
  type Data,
  type IntrospectionTarget,
  type ResourceResolver,
  type Stylesheet,
} from '@makeswift/controls'

import { rawHtmlElement } from '../../slate/PageBuilderHtmlPlugin/html'

import { RichTextV2Definition } from './rich-text-v2'
import { RichTextV2Control } from './control'

type Message = Parameters<RichTextV2Control['recv']>[0]
type InstanceArgs = ConstructorParameters<typeof RichTextV2Control>[1]

/**
 * A RichText control for the text of a Page Builder widget.
 *
 * The builder sees a normal RichText v2 control. Only the instance is
 * different, so other RichText values do not change:
 *
 * - The editor mounts only in content mode, and the builder sends `FOCUS` when
 *   it enters content mode. So a `FOCUS` before the mount waits for the editor.
 * - A selection change saves nothing. The first selection turns the Page
 *   Builder HTML into editable nodes, and that is not an edit.
 */
export class PageBuilderTextControl extends RichTextV2Control {
  private hostEditor: Editor | null = null
  private pendingFocus = false
  private readonly slateOnChange = new WeakMap<Editor, Editor['onChange']>()

  constructor(descriptor: RichTextV2Definition, args: InstanceArgs) {
    super(descriptor, args)

    const recv = this.recv
    this.recv = (message: Message) => {
      if (this.hostEditor == null) {
        if (message.type === RichTextV2Control.FOCUS) this.pendingFocus = true
        return
      }

      recv(message)
    }
  }

  setEditor(editor: Editor) {
    // Start again from the Slate handler, so a second call does not wrap it two times.
    const slateOnChange = this.slateOnChange.get(editor) ?? editor.onChange
    this.slateOnChange.set(editor, slateOnChange)
    editor.onChange = slateOnChange

    super.setEditor(editor)

    const onChange = editor.onChange
    editor.onChange = options => {
      if (options?.operation?.type !== 'set_selection') return onChange(options)

      slateOnChange(options)
      this.updatePluginValues()
    }

    this.hostEditor = editor

    if (this.pendingFocus) {
      this.pendingFocus = false
      editor.focusAndSelectAll()
    }
  }

  /** The editor unmounted, because content mode ended. */
  releaseEditor() {
    this.hostEditor = null
    this.pendingFocus = false
  }
}

type DataType = Parameters<RichTextV2Definition['toText']>[0]

/**
 * The builder sees a normal RichText v2 definition. A string value is Page
 * Builder HTML: the sidebar control of the same widget setting saved it before
 * the setting had inline editing.
 */
export class PageBuilderTextDefinition extends RichTextV2Definition {
  private readonly htmlData = new Map<string, DataType>()

  createInstance(args: InstanceArgs) {
    return new PageBuilderTextControl(this, args)
  }

  /** RichText data for a string value, the same object for the same string. */
  private richTextData(data: unknown): DataType | undefined {
    if (typeof data !== 'string') return data as DataType | undefined

    const cached = this.htmlData.get(data)
    if (cached != null) return cached

    const richText = RichTextV2Definition.nodesToDataV2(
      [rawHtmlElement(data)] as any,
      'page-builder-html',
    )
    this.htmlData.set(data, richText)
    return richText
  }

  resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    control?: RichTextV2Control,
  ) {
    return super.resolveValue(this.richTextData(data), resolver, stylesheet, control)
  }

  introspect<R>(data: DataType | undefined, target: IntrospectionTarget<R>): R[] {
    return super.introspect(this.richTextData(data), target)
  }

  copyData(data: DataType | undefined, context: CopyContext): DataType | undefined {
    return super.copyData(this.richTextData(data), context)
  }

  getTranslatableData(data: DataType | undefined): Data {
    return super.getTranslatableData(this.richTextData(data))
  }

  toText(data: DataType | undefined): string {
    return super.toText(this.richTextData(data))
  }
}
