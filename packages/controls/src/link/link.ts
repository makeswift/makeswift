import { z } from 'zod'
import memoize from 'micro-memoize'
import { match } from 'ts-pattern'

import scrollIntoView from 'scroll-into-view-if-needed'

import { type PagePathnameSlice } from '../resources'
import { type CopyContext } from '../context'
import { type ResourceResolver } from '../resource-resolver'
import { type Effector } from '../effector'

import { DefaultControlInstance, type SendMessage } from '../control-instance'

import {
  ControlDefinition,
  safeParse,
  serialize,
  type ParseResult,
  type SerializedRecord,
  type Resolvable,
  type SchemaType as SchemaType_,
} from '../control-definition'

import { type IntrospectionTarget, Targets } from '../introspect'

import { linkSchema } from './schema'

type GenericMouseEvent = {
  defaultPrevented: boolean
  preventDefault: () => void
  view: unknown
}

type LinkTarget = '_blank' | '_self'

type Config = z.infer<typeof Definition.schema.config>

type SchemaType<_C extends Config> = typeof Definition.schema

type DataType<C extends Config> = z.infer<SchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<SchemaType<C>['value']>
type ResolvedValueType<
  MouseEventType extends GenericMouseEvent,
  _C extends Config,
> = {
  href: string
  target?: LinkTarget
  onClick: (event: MouseEventType) => void
}

class Definition<
  MouseEventType extends GenericMouseEvent = GenericMouseEvent,
  C extends Config = Config,
> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<MouseEventType, C>
> {
  static readonly type = 'makeswift::controls::link' as const

  static get schema() {
    const type = z.literal(this.type)

    const link = linkSchema
    const data = z.union([link, z.null()])
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
      target: z.enum(['_blank', '_self']).optional(),
      onClick: z.function().args(z.any()).returns(z.void()),
    })

    return {
      type,
      data,
      link,
      value,
      resolvedValue,
      config,
      definition,
    }
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return {
      ...Definition.schema,
      data: Definition.schema.data as SchemaType_<DataType<C>>,
      value: Definition.schema.value as SchemaType_<ValueType<C>>,
      resolvedValue: Definition.schema.resolvedValue as SchemaType_<
        ResolvedValueType<MouseEventType, C>
      >,
    }
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
    { replacementContext }: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return data

    if (data.type === 'OPEN_PAGE') {
      const { pageId } = data.payload
      if (pageId != null) {
        return {
          ...data,
          payload: {
            ...data.payload,
            pageId: replacementContext.pageIds.get(pageId) ?? pageId,
          },
        }
      }
    }

    if (data.type === 'SCROLL_TO_ELEMENT') {
      const { elementIdConfig } = data.payload
      if (elementIdConfig == null) return data

      const { elementKey } = elementIdConfig
      return {
        ...data,
        payload: {
          ...data.payload,
          elementIdConfig: {
            ...elementIdConfig,
            elementKey:
              replacementContext.elementKeys.get(elementKey) ?? elementKey,
          },
        },
      }
    }

    return data
  }

  resolveValue(
    data: DataType<C> | undefined,
    resolver: ResourceResolver,
    _effector: Effector,
  ): Resolvable<ResolvedValueType<MouseEventType, C> | undefined> {
    const defaultResolvedValue = {
      href: '#',
      onClick: (e: MouseEventType) => {
        if (e.defaultPrevented) return
      },
    } as const

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
      readStableValue: (_previous?: ResolvedValueType<MouseEventType, C>) => {
        if (data == null) return defaultResolvedValue

        const page = pageSubscription.readStableValue()
        const elementId = elementIdSubscription.readStableValue()
        return resolveLink(data, page, elementId)
      },

      subscribe: (onUpdate: () => void) => {
        const unsubscribes = [
          pageSubscription.subscribe(onUpdate),
          elementIdSubscription.subscribe(onUpdate),
        ]

        return () => {
          unsubscribes.forEach((unsubscribe) => unsubscribe())
        }
      },

      triggerResolve: async (
        _currentValue?: ResolvedValueType<MouseEventType, C>,
      ) => {
        if (pageSubscription.readStableValue() == null) {
          pageSubscription.fetch()
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

    const handleClick = (event: MouseEventType) => {
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
          // FIXME
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
    if (target.type !== Targets.Page.type) return []
    if (data == null) return []

    switch (data.type) {
      case 'OPEN_PAGE':
        return (data.payload.pageId != null ? [data.payload.pageId] : []) as R[]

      default:
        return []
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

export const GenericLink = (config?: { label?: string }) =>
  new (class GenericLink extends Definition {})(config ?? {})

export { Definition as LinkDefinition }
