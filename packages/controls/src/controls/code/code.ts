import { match } from 'ts-pattern'
import { z } from 'zod'

import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import { type CopyContext } from '../../context'
import { type DeserializedRecord } from '../../serialization'

import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { DefaultControlInstance, type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

export const unstable_CODE_LANGUAGES = [
  'bash',
  'cpp',
  'csharp',
  'css',
  'go',
  'html',
  'java',
  'javascript',
  'json',
  'markdown',
  'python',
  'sql',
  'typescript',
  'yaml',
] as const

export type unstable_CodeLanguage = (typeof unstable_CODE_LANGUAGES)[number]

type Config = z.infer<typeof Definition.schema.relaxed.config>

type SchemaByDefaultValue<D extends Config['defaultValue']> =
  undefined extends D
    ? typeof Definition.schema.relaxed
    : typeof Definition.schema.strict

type Schema<C extends Config> = SchemaByDefaultValue<C['defaultValue']>
type DataType<C extends Config> = z.infer<Schema<C>['data']>
type ValueType<C extends Config> = z.infer<Schema<C>['value']>
type ResolvedValueType<C extends Config> = z.infer<Schema<C>['resolvedValue']>

type ReturnedSchemaType<C extends Config> = {
  definition: typeof Definition.schema.relaxed.definition
  type: typeof Definition.schema.relaxed.type
  data: SchemaType<DataType<C>>
  value: SchemaType<ValueType<C>>
  resolvedValue: SchemaType<ResolvedValueType<C>>
}

class Definition<C extends Config> extends ControlDefinition<
  typeof Definition.type,
  C,
  DataType<C>,
  ValueType<C>,
  ResolvedValueType<C>
> {
  private static readonly v1DataType = 'code::v1' as const
  private static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static readonly type = 'makeswift::controls::code' as const

  static get schema() {
    const version = z.literal(1)
    const versionedData = z.object({
      [ControlDataTypeKey]: z.literal(this.v1DataType),
      value: z.string(),
    })

    const resolvedInner = z.object({
      value: z.string(),
      language: z.enum(unstable_CODE_LANGUAGES).optional(),
    })

    const schemas = <V, D, R>(
      value: SchemaType<V>,
      data: SchemaType<D>,
      resolvedValue: SchemaType<R>,
    ) => {
      const type = z.literal(this.type)

      const config = z.object({
        label: z.string().optional(),
        description: z.string().optional(),
        defaultValue: value,
        language: z.enum(unstable_CODE_LANGUAGES).optional(),
      })

      const definition = z.object({
        type,
        config,
        version,
      })

      return {
        type,
        data,
        value,
        resolvedValue,
        config,
        definition,
        versionedData,
        version,
      }
    }

    return {
      version,
      relaxed: schemas(
        z.string().optional(),
        z.union([z.string(), versionedData, z.undefined()]),
        resolvedInner.optional(),
      ),
      strict: schemas(
        z.string(),
        z.union([z.string(), versionedData]),
        resolvedInner,
      ),
    }
  }

  static deserialize(data: DeserializedRecord): unstable_CodeDefinition {
    if (data.type !== Definition.type) {
      throw new Error(
        `Code: expected type ${Definition.type}, got ${data.type}`,
      )
    }

    const { version, config } = Definition.schema.relaxed.definition.parse(data)
    return new unstable_CodeDefinition(config, version)
  }

  constructor(
    config: C,
    readonly version: z.infer<typeof Definition.schema.relaxed.version> = 1,
  ) {
    super(config)
  }

  get controlType() {
    return Definition.type
  }

  get schema(): ReturnedSchemaType<C> {
    return Definition.schema.relaxed
  }

  get dataSchema() {
    return (
      (this.config.defaultValue === undefined
        ? Definition.schema.relaxed
        : Definition.schema.strict) as Schema<C>
    ).data
  }

  safeParse(data: unknown | undefined): ParseResult<DataType<C> | undefined> {
    return safeParse(this.dataSchema, data)
  }

  fromData(data: DataType<C> | undefined): ValueType<C> | undefined {
    const inputSchema = this.dataSchema.optional()
    return match(data satisfies z.infer<typeof inputSchema>)
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise((val) => val)
  }

  toData(value: ValueType<C>): DataType<C> {
    return (value === undefined
      ? undefined
      : { ...Definition.dataSignature.v1, value }) as DataType<C>
  }

  copyData(
    data: DataType<C> | undefined,
    _context: CopyContext,
  ): DataType<C> | undefined {
    return data
  }

  resolveValue(
    data: DataType<C> | undefined,
  ): Resolvable<ResolvedValueType<C> | undefined> {
    const value = this.fromData(data) ?? this.config.defaultValue
    const resolved =
      value === undefined
        ? undefined
        : ({ value, language: this.config.language } as ResolvedValueType<C>)
    return {
      name: Definition.type,
      readStable: () => resolved,
      subscribe: () => () => {},
      triggerResolve: async () => {},
    }
  }

  createInstance(sendMessage: SendMessage) {
    return new DefaultControlInstance(sendMessage)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitCode(this, ...args)
  }
}

export class unstable_CodeDefinition<
  C extends Config = Config,
> extends Definition<C> {}

type UserConfig<D extends Config['defaultValue']> = Config & {
  defaultValue?: D
}

type NormedConfig<D extends Config['defaultValue']> = z.infer<
  SchemaByDefaultValue<D>['config']
>

export function unstable_Code<D extends Config['defaultValue']>(
  config?: UserConfig<D>,
): unstable_CodeDefinition<NormedConfig<D>> {
  return new unstable_CodeDefinition((config ?? {}) as NormedConfig<D>, 1)
}
