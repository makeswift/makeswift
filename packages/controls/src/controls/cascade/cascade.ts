import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { Schema, type Data } from '../../common'
import { type CopyContext } from '../../context'
import { type ResourceResolver } from '../../resources/resolver'
import { type DeserializedRecord } from '../../serialization'
import { type Stylesheet } from '../../stylesheet'

import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

export type ComboboxOption<T extends Data> = {
  id: string
  value: T
  label: string
}
export type ImageOption = { id: string; image: string; text?: string }

// StageCtx uses `unknown` for selection values to avoid a circular type.
export type StageCtx = { selections: Record<string, unknown> }

export type ComboboxStage<T extends Data = Data> = {
  key: string
  display: 'combobox'
  getOptions: (
    query: string,
    ctx?: StageCtx,
  ) => ComboboxOption<T>[] | Promise<ComboboxOption<T>[]>
}

export type ImagesPage<O extends ImageOption = ImageOption> = {
  options: O[]
}
export type ImagesStage<O extends ImageOption = ImageOption> = {
  key: string
  display: 'images'
  getOptions: (ctx?: StageCtx) => ImagesPage<O> | Promise<ImagesPage<O>>
}

export type AnyStage = ComboboxStage<any> | ImagesStage<any>

export type CascadeConfig<S extends readonly AnyStage[] = readonly AnyStage[]> =
  {
    label?: string
    description?: string
    stages: S
  }

type Config<S extends readonly AnyStage[] = readonly AnyStage[]> =
  CascadeConfig<S>

// The stored option per stage, inferred structurally from `getOptions` so extra
// fields survive: images unwrap `{ options: O[] }`, combobox unwraps a bare array.
export type StoredStage<S extends AnyStage> = S extends {
  display: 'combobox'
  getOptions: (...args: any[]) => infer R
}
  ? Awaited<R> extends readonly (infer O)[]
    ? O
    : never
  : S extends {
        display: 'images'
        getOptions: (...args: any[]) => infer R
      }
    ? Awaited<R> extends { options: readonly (infer O)[] }
      ? O
      : ImageOption
    : never

// Forces TS to materialise the mapped type into explicit named properties.
type Expand<T> = { [K in keyof T]: T[K] }
type StagesToData<S extends readonly AnyStage[]> = Expand<{
  [K in S[number] as K['key']]?: StoredStage<K>
}>

// The terminal stage of the ordered tuple — the stage the control resolves to.
type LastStage<S extends readonly AnyStage[]> = S extends readonly [
  ...AnyStage[],
  infer L extends AnyStage,
]
  ? L
  : AnyStage

type StagesOf<C extends Config> =
  C extends Config<infer S> ? S : readonly AnyStage[]

type CascadeDataType<C extends Config> = StagesToData<StagesOf<C>>
// Resolves to the last stage's full option object, or undefined if unselected.
type CascadeResolvedValueType<C extends Config> =
  | StoredStage<LastStage<StagesOf<C>>>
  | undefined

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  CascadeDataType<C>,
  CascadeDataType<C>,
  CascadeResolvedValueType<C>
> {
  static readonly type = 'makeswift::controls::cascade' as const

  static schema<T extends Data>(item: SchemaType<T>) {
    const type = z.literal(Definition.type)

    const comboboxOption = z.object({
      id: z.string(),
      value: item,
      label: z.string(),
    })
    const imageOption = z.object({
      id: z.string(),
      image: z.string(),
      text: z.string().optional(),
    })

    const storedSelection = z.union([comboboxOption, imageOption])
    const data = z.record(z.string(), storedSelection)
    const value = data
    const resolvedValue = z.union([comboboxOption, imageOption]).optional()

    const stage = z.object({
      key: z.string(),
      display: z.union([z.literal('combobox'), z.literal('images')]),
      getOptions: z.function(),
    })

    const config = z.object({
      label: z.string().optional(),
      description: z.string().optional(),
      stages: z.array(stage),
    })

    const definition = z.object({ type, config })

    return { type, data, value, resolvedValue, config, definition }
  }

  static deserialize(data: DeserializedRecord): CascadeDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Cascade: expected type ${Definition.type}, got ${data.type}`,
      )
    }
    const { config } = Definition.schema(Schema.data).definition.parse(data)
    return new CascadeDefinition(config as Config)
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    return Definition.schema(Schema.data as SchemaType<Data>) as unknown as {
      type: SchemaType<typeof Definition.type>
      data: SchemaType<CascadeDataType<C>>
      value: SchemaType<CascadeDataType<C>>
      resolvedValue: SchemaType<CascadeResolvedValueType<C>>
      config: ReturnType<typeof Definition.schema>['config']
      definition: SchemaType<unknown>
    }
  }

  safeParse(
    data: unknown | undefined,
  ): ParseResult<CascadeDataType<C> | undefined> {
    return safeParse(this.schema.data, data) as ParseResult<
      CascadeDataType<C> | undefined
    >
  }

  fromData(
    data: CascadeDataType<C> | undefined,
  ): CascadeDataType<C> | undefined {
    return data
  }

  toData(value: CascadeDataType<C>): CascadeDataType<C> {
    return value
  }

  copyData(
    data: CascadeDataType<C> | undefined,
    _context: CopyContext,
  ): CascadeDataType<C> | undefined {
    return data
  }

  resolveValue(
    data: CascadeDataType<C> | undefined,
    _resolver: ResourceResolver,
    _stylesheet: Stylesheet,
  ): Resolvable<CascadeResolvedValueType<C> | undefined> {
    const stages = this.config.stages
    return {
      name: Definition.type,
      readStable: () => {
        if (data == null) return undefined
        const record = data as Record<string, unknown>
        const out: Record<string, unknown> = {}
        for (const stage of stages) {
          const selection = record[stage.key]
          if (selection == null) continue
          out[stage.key] = selection
        }
        const lastStage = stages[stages.length - 1]
        return lastStage == null
          ? undefined
          : (out[lastStage.key] as CascadeResolvedValueType<C>)
      },
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage<any>) {
    return new DefaultControlInstance(sendMessage)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitCascade(this, ...args)
  }
}

export class CascadeDefinition<
  C extends Config = Config,
> extends Definition<C> {}

export function unstable_Cascade<const S extends readonly AnyStage[]>(
  config: Config<S>,
): CascadeDefinition<Config<S>> {
  return new CascadeDefinition(config)
}
