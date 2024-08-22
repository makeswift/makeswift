import { ControlDefinition } from './definition'

export type ControlType<D> =
  D extends ControlDefinition<infer ControlType, any, any, any, any, any>
    ? ControlType
    : never

export type ConfigType<D> =
  D extends ControlDefinition<any, infer Config, any, any, any, any>
    ? Config
    : never

export type DataType<D> =
  D extends ControlDefinition<any, any, infer DataType, any, any, any>
    ? DataType
    : never

export type ValueType<D> =
  D extends ControlDefinition<any, any, any, infer ValueType, any, any>
    ? ValueType
    : never

export type ResolvedValueType<D> =
  D extends ControlDefinition<any, any, any, any, infer ResolvedValueType, any>
    ? ResolvedValueType
    : never

export type InstanceType<D> =
  D extends ControlDefinition<any, any, any, any, any, infer InstanceType>
    ? InstanceType
    : never
