import { z } from 'zod'
import { CopyContext } from '../context'

import { ResourceResolver, ValueSubscription } from '../resource-resolver'

import {
  DefaultControlInstance,
  ControlInstance,
  SendMessage,
} from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  ParseResult,
  SerializedRecord,
} from '../control-definition'
import { type Effector } from '../effector'
import {
  callPhoneLinkDataSchema,
  openPageLinkDataSchema,
  openUrlLinkDataSchema,
  scrollToElementLink,
  sendEmailLinkDataSchema,
} from './zod'
import { IntrospectionTarget, IntrospectionTargetType } from '../introspect'
import scrollIntoView from 'scroll-into-view-if-needed'
import { PagePathnameSlice } from '../common'
import memoize from 'micro-memoize'
import { match } from 'ts-pattern'

const defaultResolvedValue = {
  href: '#',
  onClick: (e: MouseEvent) => {
    if (e.defaultPrevented) return
  },
}

type LinkTarget = '_blank' | '_self'

type Config = z.infer<typeof Definition.schema.config>

type DataSchemaType<_C extends Config> = typeof Definition.schema

type DataType<C extends Config> = z.infer<DataSchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<DataSchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  DataSchemaType<C>['resolvedValue']
>

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::link' as const

  constructor(readonly config: C) {
    super(config)
  }

  static get schema() {
    const type = z.literal(this.type)

    const data = z.union([
      openPageLinkDataSchema,
      openUrlLinkDataSchema,
      sendEmailLinkDataSchema,
      callPhoneLinkDataSchema,
      scrollToElementLink,
      z.null(),
    ])

    const value = data

    const config = z.object({
      label: z.string().optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    const resolvedValue = z.object({
      href: z.string(),
      target: z.union([z.literal('_blank'), z.literal('_self')]).optional(),
      onClick: z.function().args(z.any()).returns(z.void()),
    })

    return {
      type,
      data,
      value,
      resolvedValue,
      config,
      definition,
    }
  }

  static deserialize(data: SerializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Link: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { config } = Definition.schema.definition.parse(data)
    return new Definition(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    return this.schema.data.optional().parse(data)
  }

  toData(value: ValueType<C>): DataType<C> {
    return value
  }

  copyData(
    data: DataType<C> | undefined,
    _context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    if (data.type === 'OPEN_PAGE') {
      const pageId = data.payload.pageId
      if (pageId != null) {
        return {
          ...data,
          payload: {
            ...data.payload,
            pageId: _context.replacementContext.pageIds.get(pageId) ?? pageId,
          },
        }
      }
    }

    return data
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    _effector: Effector,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    const pageId = data?.type === 'OPEN_PAGE' ? data.payload.pageId : null
    const pageSubscription = resolver.resolvePagePathnameSlice(
      pageId ?? undefined,
    )

    const elementKey =
      data?.type === 'SCROLL_TO_ELEMENT'
        ? data.payload.elementIdConfig?.elementKey
        : null

    const elementIdSubscription = resolver.resolveElementId(elementKey ?? '')
    // FIXME: @arvin review whether we need memoize library to do this
    const resolveLink = memoize(this.resolveLinkPropValues)

    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        if (data == null) return defaultResolvedValue
        const page = pageSubscription.readStableValue()
        const elementId = elementIdSubscription.readStableValue()
        return resolveLink(data, page, elementId)
      },
      subscribe: () => {
        const unsubscribes = [
          pageSubscription.subscribe(() => {}),
          elementIdSubscription.subscribe(() => {}),
        ]
        return () => {
          unsubscribes.forEach((unsubscribe) => unsubscribe())
        }
      },
    }
  }

  resolveLinkPropValues(
    data: DataType<C> | undefined,
    page: PagePathnameSlice | null,
    elementId: string | null,
  ) {
    const { href, target, block } = match(data)
      .with({ type: 'OPEN_PAGE' }, ({ payload }) => {
        const href =
          page != null ? `/${page.localizedPathname ?? page.pathname}` : '#'
        const target: LinkTarget = payload.openInNewTab ? '_blank' : '_self'
        return { href, target, block: undefined }
      })
      .with({ type: 'OPEN_URL' }, ({ payload }) => {
        const href = payload.url
        const target: LinkTarget = payload.openInNewTab ? '_blank' : '_self'
        return { href, target, block: undefined }
      })
      .with({ type: 'SEND_EMAIL' }, ({ payload }) => {
        const { to, subject = '', body = '' } = payload
        const href =
          to != null ? `mailto:${to}?subject=${subject}&body=${body}` : '#'
        return { href, target: undefined, block: undefined }
      })
      .with({ type: 'CALL_PHONE' }, ({ payload }) => {
        const href = `tel:${payload.phoneNumber}`
        return { href, target: undefined, block: undefined }
      })
      .with({ type: 'SCROLL_TO_ELEMENT' }, ({ payload }) => {
        const href = `#${elementId ?? ''}`
        const block = payload.block
        return { href, block, target: undefined }
      })
      .otherwise(() => {
        throw new RangeError(`Invalid link type "${(data as any).type}".`)
      })

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (data && data.type === 'SCROLL_TO_ELEMENT') {
        let hash: string | undefined

        try {
          hash = new URL(`http://www.example.com/${href}`).hash
        } catch (error) {
          console.error(`Link received invalid href: ${href}`, error)
        }

        if (href != null && href === hash) {
          event.preventDefault()
          const view = event.view as unknown as Window

          scrollIntoView(view.document.querySelector(hash)!, {
            behavior: 'smooth',
            block,
          })

          if (view.location.hash !== hash) view.history.pushState({}, '', hash)
        }
      }
    }

    return {
      href,
      target,
      onClick: handleClick,
    }
  }

  introspect<R>(
    data: DataType<C> | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    if (target.type !== IntrospectionTargetType.Page) return []
    if (data == null) return []
    switch (data.type) {
      case 'OPEN_PAGE':
        return (data.payload.pageId != null ? [data.payload.pageId] : []) as R[]
      default:
        return []
    }
  }

  createInstance(sendMessage: SendMessage<any>): ControlInstance<any> {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

export const Link = <C extends Config>(config?: C) =>
  new (class Link extends Definition<C> {})(config ?? ({} as C))

export { Definition as LinkDefinition }
