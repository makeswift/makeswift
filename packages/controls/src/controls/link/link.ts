import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { type CopyContext } from '../../context'
import { Targets, type IntrospectionTarget } from '../../introspection'
import { type SerializedRecord } from '../../serialization'

import { ControlDefinition, serialize, type SchemaType } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

import { type GenericMouseEvent } from './mouse-event'
import { linkSchema } from './schema'

type Config = z.infer<typeof Definition.schema.config>

type Schema<_C extends Config> = typeof Definition.schema
type LinkTarget<C extends Config> = z.infer<Schema<C>['linkTarget']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<
  MouseEventType extends GenericMouseEvent,
  C extends Config,
> = {
  href: string
  target?: LinkTarget<C>
  onClick: (event: MouseEventType) => void
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

    const linkTarget = z.enum(['_blank', '_self'])

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
