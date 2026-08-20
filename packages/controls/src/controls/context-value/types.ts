import {
  type ConfigType,
  type ContainerType,
  type ResolvedValueType,
} from '../associated-types'
import { KeyedContainer, MultiValueContainer } from '../definition'

// Declaration
export type ContextValue<Id extends string = string, T = unknown> = {
  readonly id: Id
  readonly __value?: T
}

export type ContextValueBuilder<Id extends string> = {
  ofType<V>(): ContextValue<Id, V>
}

// Providing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyContextValue = ContextValue<string, any>

// Dependency
export type ContextValueDependencies = Record<string, AnyContextValue>

// Runtime
export type ContextValues<D extends ContextValueDependencies> = {
  [K in keyof D]: ContextValueOf<D[K]> | undefined
}

export type ContextIdOf<C> =
  C extends ContextValue<infer Id, unknown> ? Id : never
export type ContextValueOf<C> =
  C extends ContextValue<string, infer V> ? V : never

// Configs
// Unconstrained versions used for typechecking to prevent type widening
// see: https://github.com/microsoft/TypeScript/issues/49238
type DependsOnConfigUnconstrained<D> = { dependsOn?: D }
type ProvidesConfigUnconstrained<P> = { provides?: P }

// Constrained versions used for control config mixins
export type ProvidesConfig<P extends AnyContextValue> =
  ProvidesConfigUnconstrained<P>
export type DependsOnConfig<D extends ContextValueDependencies> =
  DependsOnConfigUnconstrained<D>

// Validation
type HasConfig<Def> = [ConfigType<Def>] extends [never] ? false : true

export type ProvidedContext<Def> =
  HasConfig<Def> extends false
    ? never
    : ConfigType<Def> extends ProvidesConfigUnconstrained<infer P>
      ? NonNullable<P>
      : never

export type ProvidedContextId<Def> = ContextIdOf<ProvidedContext<Def>>

export type ContextDependencies<Def> =
  HasConfig<Def> extends false
    ? never
    : ConfigType<Def> extends DependsOnConfigUnconstrained<infer D>
      ? NonNullable<D>[keyof NonNullable<D>]
      : never

export type ContextDependencyIds<Def> =
  HasConfig<Def> extends false
    ? never
    : ConfigType<Def> extends DependsOnConfigUnconstrained<infer D>
      ? ContextIdOf<NonNullable<D>[keyof NonNullable<D>]>
      : never

export type ProvidedIds<Def> = Def extends unknown
  ? ProvidedIdsImpl<Def>
  : never
type ProvidedIdsImpl<Def, C = ContainerType<Def>> = [C] extends [
  KeyedContainer<infer Defs>,
]
  ? { [K in keyof Defs]: ProvidedIds<Defs[K]> }[keyof Defs]
  : [C] extends [MultiValueContainer<unknown>]
    ? never
    : ProvidedContextId<Def>

export type RequiredIds<Def> = Def extends unknown
  ? RequiredIdsImpl<Def>
  : never
type RequiredIdsImpl<Def, C = ContainerType<Def>> = [C] extends [
  KeyedContainer<infer Defs>,
]
  ? { [K in keyof Defs]: RequiredIds<Defs[K]> }[keyof Defs]
  : [C] extends [MultiValueContainer<infer Item>]
    ? RequiredIds<Item>
    : ContextDependencyIds<Def>

/** Context ids provided under a multivalue container. */
export type MultiValueProvidedIds<Def> = Def extends unknown
  ? MultiValueProvidedIdsImpl<Def>
  : never
type MultiValueProvidedIdsImpl<Def, C = ContainerType<Def>> = [C] extends [
  KeyedContainer<infer Defs>,
]
  ? { [K in keyof Defs]: MultiValueProvidedIds<Defs[K]> }[keyof Defs]
  : [C] extends [MultiValueContainer<infer Item>]
    ? ProvidedIds<Item> | MultiValueProvidedIds<Item>
    : never

// Non-distributive on purpose: a resolved value type is usually a union
// (`T | undefined`), and a distributive conditional would union `unknown` in
// from the matching branches, which absorbs the error.
type ContextAccepts<C, Resolved> = [Resolved] extends [
  ContextValueOf<C> | undefined,
]
  ? true
  : false

/**
 * Ids whose provider resolves to a value the context doesn't accept.
 */
export type MismatchedProvidedIds<Def> = Def extends unknown
  ? MismatchedProvidedIdsOf<Def>
  : never
type MismatchedProvidedIdsOf<Def, C = ContainerType<Def>> = [C] extends [
  KeyedContainer<infer Defs>,
]
  ? { [K in keyof Defs]: MismatchedProvidedIds<Defs[K]> }[keyof Defs]
  : [C] extends [MultiValueContainer<infer Item>]
    ? MismatchedProvidedIds<Item>
    : [ProvidedContext<Def>] extends [never]
      ? never
      : ContextAccepts<
            ProvidedContext<Def>,
            ResolvedValueType<Def>
          > extends true
        ? never
        : ProvidedContextId<Def>

/**
 * Ids provided more than once within a record of definitions.
 */
export type DuplicateIds<R> = {
  [K in keyof R]:
    | DuplicateIdsWithin<R[K]>
    | Extract<ProvidedIds<R[K]>, ProvidedIds<R[Exclude<keyof R, K>]>>
}[keyof R]

type DuplicateIdsWithin<Def> = Def extends unknown
  ? DuplicateIdsWithinImpl<Def>
  : never
type DuplicateIdsWithinImpl<Def, C = ContainerType<Def>> = [C] extends [
  KeyedContainer<infer Defs>,
]
  ? DuplicateIds<Defs>
  : [C] extends [MultiValueContainer<infer Item>]
    ? // a provider in here is already a `ProviderInMultiValue` error
      DuplicateIdsWithin<Item>
    : never

// Validation errors
export type UnprovidedContext<Ids extends string> = [Ids] extends [never]
  ? never
  : `This control depends on context (${Ids}) that nothing in this component provides`

export type ProviderInMultiValue<Ids extends string> = [Ids] extends [never]
  ? never
  : `controls inside multi value controls cannot provide context (${Ids})`

export type ProvidesMismatch<Ids extends string> = [Ids] extends [never]
  ? never
  : `this control resolves to a value the context it provides ${Ids} does not accept`

export type DuplicateProvider<Ids extends string> = [Ids] extends [never]
  ? never
  : `more than one prop in this component provides this context (${Ids}).A context must have exactly one provider`

type ErrorsFor<Def, Provided, Duplicated> =
  | DuplicateProvider<Extract<ProvidedIds<Def>, Duplicated>>
  | UnprovidedContext<Exclude<RequiredIds<Def>, Provided>>
  | ProviderInMultiValue<MultiValueProvidedIds<Def>>
  | ProvidesMismatch<MismatchedProvidedIds<Def>>

type ValidatedAgainst<P, Provided, Duplicated> = {
  [K in keyof P]: [ErrorsFor<P[K], Provided, Duplicated>] extends [never]
    ? P[K]
    : ErrorsFor<P[K], Provided, Duplicated>
}

export type PropsWithValidContextUsage<P> = ValidatedAgainst<
  P,
  ProvidedIds<P[keyof P]>,
  DuplicateIds<P>
>
