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

type Config = z.infer<typeof Definition.schema.config>

type DataSchemaType<_C extends Config> = typeof Definition.schema

type DataType<C extends Config> = z.infer<DataSchemaType<C>['data']>
type ValueType<C extends Config> = z.infer<DataSchemaType<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<
  DataSchemaType<C>['resolvedValue']
>

const t = {
  href: '#arvin',
  onClick: () => {
    console.log('Arvin was here')
  },
}

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
    _data: DataType<C> | undefined,
    _resolver: ResourceResolver,
    _effector: Effector,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    return {
      readStableValue: (_previous?: ResolvedValueType<C>) => {
        return t
        // return (
        //   this.fromData(data) ?? {
        //     href: '#',
        //     onClick: () => {},
        //   }
        // )
      },
      subscribe: () => () => {},
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
