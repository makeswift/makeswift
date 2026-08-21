import type { ContextValue, ContextValueBuilder } from './types'

export * from './predicates'
export * from './types'
export * from './schemas'

/**
 * Declares a value one control makes available to others in the same component.
 *
 * ```ts
 * const stateName = unstable_ContextValue('stateName').ofType<string>()
 *
 * props: {
 *   stateName: Combobox({ provides: stateName, getOptions(q) { ... } }),
 *   cityName: Combobox({
 *     dependsOn: { selectedState: stateName },
 *     getOptions(query, context) { ... }, // context: { selectedState: string | undefined }
 *   }),
 * }
 * ```
 *
 */
export function unstable_ContextValue<Id extends string>(
  id: Id,
): ContextValueBuilder<Id> {
  /*
    The context construction is split across two calls because TypeScript has no partial
    type argument inference: naming `T` explicitly in a single call would prevent
    `Id` being inferred. This prevents requiring duplicate declarations of the id.
  */
  return { ofType: <T>(): ContextValue<Id, T> => ({ id }) }
}
