export type AssociatedTypes<T> = T extends {
  __associated_types__?: infer Types
}
  ? Types extends (...args: any) => any
    ? ReturnType<Types>
    : never
  : never

export type AssociatedType<
  T,
  K extends keyof AssociatedTypes<T>,
> = AssociatedTypes<T>[K]
