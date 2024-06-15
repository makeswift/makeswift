import { WithAssociatedTypes } from './utils/associated-types'
import {
  type ValueType,
  type ResolvedValueType,
  type CopyContext,
} from './common'
import { ResourceResolver, type ResolvableValue } from './resource-resolver'
import { ControlInstance, type Send } from './control-instance'

export type VersionedControlDefinition<
  ControlType = string,
  Config = any,
  ValueType = any,
  Version extends number = number,
  ResolvedValueType = ValueType,
> = WithAssociatedTypes<{
  ControlType: ControlType
  Config: Config
  ValueType: ValueType
  ResolvedValueType: ResolvedValueType
}> & {
  type: ControlType
  config: Config
  version?: Version
}

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type ControlTraits<
  ControlType = string,
  ControlData = any,
  ControlDefinition = VersionedControlDefinition,
  _ValueType = ValueType<ControlDefinition>,
  _ResolvedValueType = ResolvedValueType<ControlDefinition>,
  InstanceType = ControlInstance<unknown>,
> = WithAssociatedTypes<{
  ControlType: ControlType
  ControlData: ControlData
  ControlDefinition: ControlDefinition
  ValueType: _ValueType
  ResolvedValueType: _ResolvedValueType
  InstanceType: InstanceType
}> & {
  get controlType(): ControlType

  safeParse(data: unknown | undefined): ParseResult<ControlData | undefined>

  fromData(data: ControlData, definition: ControlDefinition): _ValueType
  fromData(
    data: ControlData | undefined,
    definition: ControlDefinition,
  ): _ValueType | undefined

  toData(value: _ValueType, definition: ControlDefinition): ControlData

  copyData(
    data: ControlData | undefined,
    context: CopyContext,
  ): ControlData | undefined

  resolveValue(
    value: _ValueType,
    definition: ControlDefinition,
    resolver: ResourceResolver,
  ): ResolvableValue<_ResolvedValueType>

  createInstance(send: Send): InstanceType

  // introspection
  getSwatchIds(data: ControlData | undefined): string[]
}
