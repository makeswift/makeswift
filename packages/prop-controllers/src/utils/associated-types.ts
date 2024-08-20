export type WithAssociatedTypes<T> = {
  readonly __associated_types__?: T
}

export type AssociatedTypes<T> = T extends {
  __associated_types__?: infer Types
}
  ? Types extends Record<string, unknown>
    ? Types
    : never
  : never

export type AssociatedType<
  T,
  K extends keyof AssociatedTypes<T>,
> = AssociatedTypes<T>[K]
