import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import {
  type DeserializedRecord,
  type SerializedRecord,
} from '../../serialization'

import { ControlDefinition, serialize, type Resolvable } from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'

type Schema = typeof Definition.schema
type DataType = z.infer<Schema['data']>
type ValueType = z.infer<Schema['value']>
type ResolvedValueType = z.infer<Schema['resolvedValue']>
type InstanceType = DefaultControlInstance

class Definition extends ControlDefinition<
  typeof Definition.type,
  unknown,
  DataType,
  ValueType,
  ResolvedValueType,
  InstanceType
> {
  static readonly type = 'makeswift::controls::font' as const

  static get schema() {
    const type = z.literal(Definition.type)

    const data = z.object({
      fontFamily: z.string(),
      fontStyle: z.string(),
      fontWeight: z.number(),
    })

    const value = data
    const resolvedValue = data

    const definition = z.object({
      type,
    })

    return {
      type,
      definition,
      data,
      value,
      resolvedValue,
    }
  }

  static deserialize(data: DeserializedRecord): Definition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Font: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    Definition.schema.definition.parse(data)
    return new (class Font extends Definition {})()
  }

  constructor() {
    super({})
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    return this.schema.data.optional().parse(data)
  }

  toData(value: ValueType): DataType {
    return value
  }

  copyData(data: DataType | undefined): DataType | undefined {
    if (data == null) return data

    return {
      ...data,
    }
  }

  resolveValue(
    data: DataType | undefined,
  ): Resolvable<ResolvedValueType | undefined> {
    return {
      readStableValue: () => this.fromData(data),
      subscribe: () => () => {},
    }
  }

  createInstance(sendMessage: SendMessage) {
    return new DefaultControlInstance(sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }
}

export class FontDefinition extends Definition {}

export function Font(): FontDefinition {
  return new FontDefinition()
}
