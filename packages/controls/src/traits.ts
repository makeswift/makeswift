import { WithAssociatedTypes } from './utils/associated-types'
import { type ValueType, type CopyContext, type Data } from './common'
import { ResourceResolver } from './resource-resolver'

export type VersionedControlDefinition<
  ControlType = string,
  Config = any,
  ValueType = any,
  Version extends number = number,
> = WithAssociatedTypes<{
  ControlType: ControlType
  Config: Config
  ValueType: ValueType
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
> = WithAssociatedTypes<{
  ControlType: ControlType
  ControlData: ControlData
  ControlDefinition: ControlDefinition
  ValueType: _ValueType
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
  ): Promise<Data>

  // introspection
  getSwatchIds(data: ControlData | undefined): string[]
}
