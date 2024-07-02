import { z } from 'zod'
import { ControlDefinition, ParseResult } from '../control-definition'
import {
  safeParse,
  serialize,
  type SerializedRecord,
  type DataType as DataType_,
  type ValueType as ValueType_,
  type ResolvedValueType as ResolvedValueType_,
} from '../control-definition'

import { type Effector } from '../effector'

import { CopyContext } from '../context'
import { ResourceResolver, ValueSubscription } from '../resource-resolver'
import { IntrospectionTarget } from '../introspect'
import { SendMessage } from '../control-instance'
import { ShapeControl } from './shape-control'
import { mapValues, objectsAreEqual } from '../utils/functional'
import { Deserialized } from '../serialization'

type Config = {
  type: Record<string, ControlDefinition>
}

type DataType<C extends Config> = {
  [K in keyof C['type']]?: DataType_<C['type'][K]>
}

type ValueType<C extends Config> = {
  [K in keyof C['type']]?: ValueType_<C['type'][K]>
}

type ResolvedValueType<C extends Config> = {
  [K in keyof C['type']]?: ResolvedValueType_<C['type'][K]>
}

class Definition<C extends Config = Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>,
  ShapeControl<Definition<C>>
> {
  static readonly type = 'makeswift::controls::shape' as const

  constructor(readonly config: C) {
    super(config)
  }

  static deserialize(
    data: SerializedRecord,
    deserializeCallback: (r: SerializedRecord) => ControlDefinition,
  ) {
    if (data.type !== Definition.type)
      throw new Error(
        `Shape: expected '${Definition.type}', got '${data.type}'`,
      )

    const {
      config: { type, ...config },
    } = z
      .object({
        type: z.literal(Definition.type),
        config: z.any(),
      })
      .parse(data)

    const itemDef = deserializeCallback(type)
    return new Definition<Deserialized<Config>>({ type: itemDef, ...config })
  }

  get keyDefs() {
    return this.config.type
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const type = z.literal(Definition.type)
    const keys = mapValues(this.keyDefs, (def) => def.schema)

    const data = z.object(mapValues(keys, (key) => key.data))
    const value = z.object(mapValues(keys, (key) => key.value))
    const resolvedValue = z.object(mapValues(keys, (key) => key.resolvedValue))

    const config = z.object({
      type: z.object(mapValues(keys, (key) => key.definition)),
    })

    const definition = z.object({
      type,
      config,
    })

    return { type, data, value, resolvedValue, config, definition }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.schema.data, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    if (data == null) return undefined
    return mapValues(data, (value, key) =>
      this.keyDefs[key as string]?.fromData(value),
    )
  }

  toData(value: ValueType<C>): DataType<C> {
    return mapValues(value, (value, key) =>
      this.keyDefs[key as string]?.toData(value),
    )
  }

  copyData(
    data: DataType<C> | undefined,
    context: CopyContext,
  ): DataType<C> | undefined {
    if (data == null) return undefined
    return mapValues(data, (value, key) =>
      this.keyDefs[key as string].copyData(value, context),
    )
  }

  resolveValue(
    value: ValueType<C> | undefined,
    resolver: ResourceResolver,
    effector: Effector,
  ): ValueSubscription<ResolvedValueType<C> | undefined> {
    const emptyShape: ResolvedValueType<C> = {}
    const keyValues = mapValues(value ?? ({} as ValueType<C>), (val, key) =>
      this.keyDefs[key as string]?.resolveValue(val, resolver, effector),
    )

    return {
      readStableValue: (previous?: ResolvedValueType<C>) => {
        const r = mapValues(keyValues, (v, key) =>
          v?.readStableValue(previous?.[key]),
        )

        return (objectsAreEqual(r, previous) ? previous : r) ?? emptyShape
      },

      subscribe: (onUpdate: () => void) => {
        const unsubscribes = Object.values(keyValues).map((v) =>
          v?.subscribe(onUpdate),
        )

        return () => unsubscribes.forEach((u) => u())
      },
    }
  }

  createInstance(sendMessage: SendMessage<any>): ShapeControl<Definition<C>> {
    return new ShapeControl(this, sendMessage)
  }

  serialize(): [SerializedRecord, Transferable[]] {
    return serialize(this.config, {
      type: Definition.type,
    })
  }

  introspect<R>(data: DataType<C> | undefined, target: IntrospectionTarget<R>) {
    return Object.entries(data ?? {}).flatMap(([key, value]) =>
      this.keyDefs[key as string].introspect(value, target),
    )
  }
}

export const Shape = <C extends Config>(config: C) =>
  new (class Shape extends Definition<C> {})(config)

export { Definition as ShapeDefinition }
