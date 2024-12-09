export type AssociatedTypes<T> = T extends {
  __associatedTypes(types: infer Types): void
}
  ? Types extends Record<string, unknown>
    ? Types
    : never
  : never

export type AssociatedType<
  T,
  K extends keyof AssociatedTypes<T>,
> = AssociatedTypes<T>[K]

export type ControlType<D> = AssociatedType<D, 'ControlType'>
export type ConfigType<D> = AssociatedType<D, 'Config'>
export type DataType<D> = AssociatedType<D, 'DataType'>
export type ValueType<D> = AssociatedType<D, 'ValueType'>
export type ResolvedValueType<D> = AssociatedType<D, 'ResolvedValueType'>
export type InstanceType<D> = AssociatedType<D, 'InstanceType'>
