import { z } from 'zod'

import { type ValueSubscription } from '../lib/value-subscription'
import { type ParseResult } from '../lib/zod'

import { type Data } from '../common/types'
import { type CopyContext, type MergeContext } from '../context'
import { type IntrospectionTarget } from '../introspection'
import { type ResourceResolver } from '../resources/resolver'
import { type Stylesheet } from '../stylesheet'

import { ControlInstance, type ControlInstanceArgs } from './instance'
import { ControlDefinitionVisitor } from './visitor'

export type SchemaType<T> = z.ZodType<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaTypeAny = SchemaType<any> | z.ZodBranded<SchemaType<any>, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyControlInstance = ControlInstance<any>

export type Resolvable<T> = ValueSubscription<T> & {
  triggerResolve(currentValue?: T): Promise<unknown>
}

export type KeyedContainer<T> = { kind: 'keyed'; type: T }
export type MultiValueContainer<T> = { kind: 'multivalue'; type: T }
export type Scalar = { kind: 'scalar' }

export type AnyContainerType =
  | KeyedContainer<unknown>
  | MultiValueContainer<unknown>
  | Scalar

export abstract class ControlDefinition<
  ControlType extends string = string,
  Config = unknown,
  DataType extends Data = Data,
  ValueType extends Data = Data,
  ResolvedValueType = Data | unknown,
  InstanceType extends AnyControlInstance = AnyControlInstance,
  ContainerType extends AnyContainerType = AnyContainerType,
> {
  // workaround for TypeScript type inference issues: https://bit.ly/4g2RvOQ
  __associatedTypes(_: {
    ControlType: ControlType
    Config: Config
    DataType: DataType
    ValueType: ValueType
    ResolvedValueType: ResolvedValueType
    InstanceType: InstanceType
    ContainerType: ContainerType
  }) {}

  constructor(readonly config: Config) {}

  abstract get controlType(): ControlType

  abstract get schema(): {
    definition: SchemaType<unknown>
    type: SchemaType<ControlType>
    data: SchemaType<DataType>
    value: SchemaType<ValueType>
    resolvedValue: SchemaType<ResolvedValueType>
  }

  abstract safeParse(
    data: unknown | undefined,
  ): ParseResult<DataType | undefined>

  abstract fromData(data: DataType | undefined): ValueType | undefined
  abstract toData(value: ValueType): DataType

  abstract copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined

  mergeData(
    base: DataType,
    override: DataType | undefined,
    _context: MergeContext,
  ): DataType {
    return override ?? base
  }

  getTranslatableData(_data: DataType | undefined): Data {
    return null
  }

  abstract resolveValueFromData(
    data: DataType | undefined,
  ): ResolvedValueType | undefined

  abstract resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    control?: InstanceType,
  ): Resolvable<ResolvedValueType | undefined>

  abstract createInstance(args: ControlInstanceArgs): InstanceType

  abstract accept<R>(
    visitor: ControlDefinitionVisitor<R>,
    ...args: unknown[]
  ): R

  introspect<R>(
    data: DataType | undefined,
    target: IntrospectionTarget<R>,
  ): R[] {
    return target.introspect(data)
  }
}
