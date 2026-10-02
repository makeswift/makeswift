import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { type Data } from '../../common'
import { type CopyContext } from '../../context'

import {
  ControlDefinition,
  type AnyControlInstance,
  type Resolvable,
} from '../definition'
import { ControlDefinitionVisitor } from '../visitor'

type Config = z.infer<ReturnType<typeof HtmlTextDefinition.schema>['config']>

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
  string,
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
      data: z.string(),
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

  safeParse(data: unknown | undefined): ParseResult<string | undefined> {
    return safeParse(HtmlTextDefinition.schema().data.optional(), data)
  }

  fromData(data: string | undefined): string | undefined {
    return data
  }

  toData(value: string): string {
    return value
  }

  copyData(
    data: string | undefined,
    _context: CopyContext,
  ): string | undefined {
    return data
  }

  getTranslatableData(data: string | undefined): Data {
    return data ?? null
  }

  /** The saved HTML, or the default HTML. */
  resolveValueFromData(data: string | undefined): string {
    return data ?? this.config.defaultValue
  }

  resolveValue(data: string | undefined): Resolvable<string> {
    return {
      name: HtmlTextDefinition.type,
      readStable: () => this.resolveValueFromData(data),
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  /** The text of the HTML, for example for the panel and for search. */
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
