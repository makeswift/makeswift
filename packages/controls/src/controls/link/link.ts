import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type CopyContext } from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import { type SerializedRecord } from '../../serialization'

import {
  ControlDefinition,
  serialize,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

import { type GenericMouseEvent } from './mouse-event'
import { resolveLink } from './resolve-link'
import * as LinkSchema from './schema'

type Config = z.infer<typeof Definition.schema.config>

type Schema<_C extends Config> = typeof Definition.schema
type LinkTarget<C extends Config> = z.infer<Schema<C>['linkTarget']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>

type ScrollOptions = z.infer<typeof LinkSchema.scrollOptions>
type OnClick<MouseEventType extends GenericMouseEvent> = ((
  event: MouseEventType,
) => void) & {
  $scrollOptions?: ScrollOptions
}

type ResolvedValueType<
  MouseEventType extends GenericMouseEvent,
  C extends Config,
> = {
  href: string
  target?: LinkTarget<C>
  onClick: OnClick<MouseEventType>
}

class Definition<
  MouseEventType extends GenericMouseEvent = GenericMouseEvent,
  C extends Config = Config,
> extends ControlDefinition<
  typeof Definition.type,
  Config,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<MouseEventType, C>
> {
  static readonly type = 'makeswift::controls::link' as const

  static get schema() {
    const type = z.literal(this.type)

    const link = LinkSchema.link
    const data = LinkSchema.data
    const value = data

    const config = z.object({
      label: z.string().optional(),
    })

    const definition = z.object({
      type,
      config,
    })

    const linkTarget = LinkSchema.target

    const resolvedValue = z.object({
      href: z.string(),
      target: linkTarget.optional(),
      onClick: z.function().args(z.any()).returns(z.void()),
    })

    return {
      type,
      data,
      link,
      linkTarget,
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
      data: Definition.schema.data as SchemaType<DataType<C>>,
      value: Definition.schema.value as SchemaType<ValueType<C>>,
      resolvedValue: Definition.schema.resolvedValue as SchemaType<
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
  ): Resolvable<ResolvedValueType<MouseEventType, C>> {
    const emptyLink = {
      href: '#',
      onClick: (e: MouseEventType) => {
        if (e.defaultPrevented) return
      },
    } as const

    const pageId = data?.type === 'OPEN_PAGE' ? data.payload.pageId : null
    const pageSub = resolver.resolvePagePathnameSlice(pageId ?? undefined)

    const elementKey =
      data?.type === 'SCROLL_TO_ELEMENT'
        ? data.payload.elementIdConfig?.elementKey
        : null

    const elementIdSub = resolver.resolveElementId(elementKey ?? '')

    const stableValue = StableValue({
      name: Definition.type,
      read: () => {
        if (data == null) return emptyLink

        const page = pageSub.readStable()
        const elementId = elementIdSub.readStable()
        const { href, target, scrollOptions } = resolveLink(
          data,
          page,
          elementId,
        )

        return {
          href,
          target,
          onClick: this.resolveOnClick(data, href, scrollOptions),
        }
      },
      deps: [pageSub, elementIdSub],
    })

    return {
      ...stableValue,
      triggerResolve: async () => {
        if (pageSub.readStable() == null) {
          pageSub.fetch()
        }
      },
    }
  }

  resolveOnClick(
    _data: DataType<C> | undefined,
    _href: string,
    scrollOptions: ScrollOptions | undefined,
  ): OnClick<MouseEventType> {
    const onClick = (event: MouseEventType) => {
      if (event.defaultPrevented) return
    }

    onClick.$scrollOptions = scrollOptions
    return onClick
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

export { Definition as LinkDefinition, type GenericMouseEvent }
