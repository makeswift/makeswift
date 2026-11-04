import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import {
  AcceptedTextDataTypes,
  ControlDataTypeKey,
  type Data,
} from '../../common'
import { type CopyContext } from '../../context'

import {
  ControlDefinition,
  type AnyControlInstance,
  type Resolvable,
} from '../definition'
import { ControlDefinitionVisitor } from '../visitor'

type Config = z.infer<ReturnType<typeof HtmlTextDefinition.schema>['config']>

/**
 * The data that a text control saves: `TextInput`, `TextArea`, or `Code`.
 * A host can give an existing text setting this control. Then the saved data
 * of the old control stays until the first edit saves a string over it.
 */
const textControlData = z.object({
  [ControlDataTypeKey]: z.enum(AcceptedTextDataTypes),
  value: z.string(),
})

type HtmlTextData = string | z.infer<typeof textControlData>

/**
 * Unstable. A text control whose value is an HTML string. An editor in the
 * host page edits the HTML in place, and the builder panel sets the formats.
 *
 * This base class holds the data rules. A runtime subclass creates the
 * control instance.
 */
export abstract class HtmlTextDefinition<
  InstanceType extends AnyControlInstance = AnyControlInstance,
> extends ControlDefinition<
  typeof HtmlTextDefinition.type,
  Config,
  HtmlTextData,
  string,
  string,
  InstanceType
> {
  static readonly type = 'makeswift::controls::unstable-html-text' as const

  static schema() {
    const type = z.literal(this.type)
    const config = z.object({
      label: z.string().optional(),
      description: z.string().optional(),
      defaultValue: z.string(),
    })

    return {
      type,
      config,
      definition: z.object({ type, config }),
      data: z.union([z.string(), textControlData]),
      value: z.string(),
      resolvedValue: z.string(),
    }
  }

  get controlType() {
    return HtmlTextDefinition.type
  }

  get schema() {
    return HtmlTextDefinition.schema()
  }

  safeParse(data: unknown | undefined): ParseResult<HtmlTextData | undefined> {
    return safeParse(HtmlTextDefinition.schema().data.optional(), data)
  }

  /** The HTML of saved data: a string, or the value of a text control. */
  fromData(data: unknown): string | undefined {
    if (typeof data === 'string') return data

    const text = textControlData.safeParse(data)
    return text.success ? text.data.value : undefined
  }

  toData(value: string): string {
    return value
  }

  copyData(
    data: HtmlTextData | undefined,
    _context: CopyContext,
  ): HtmlTextData | undefined {
    return data
  }

  getTranslatableData(data: HtmlTextData | undefined): Data {
    return this.fromData(data) ?? null
  }

  /** The saved HTML, or the default HTML. */
  resolveValueFromData(data: unknown): string {
    return this.fromData(data) ?? this.config.defaultValue
  }

  resolveValue(data: HtmlTextData | undefined): Resolvable<string> {
    return {
      name: HtmlTextDefinition.type,
      readStable: () => this.resolveValueFromData(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  /** The text of the HTML, for the builder panel. */
  toText(data: string | undefined): string {
    if (data == null) return ''

    return data
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitHtmlText(this, ...args)
  }
}
