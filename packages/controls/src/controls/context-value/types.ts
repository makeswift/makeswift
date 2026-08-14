import {
  type ConfigType,
  type ControlType,
  type ResolvedValueType,
} from '../associated-types'

// Declaration
export type ContextValue<Id extends string = string, T = unknown> = {
  readonly id: Id
  readonly __value?: T
}

export type ContextValueBuilder<Id extends string> = {
  withType<V>(): ContextValue<Id, V>
}

// Providing
export type AnyContextValue = ContextValue<string, any>

// Dependency
export type ContextValueDependencies = Record<string, AnyContextValue>

// Runtime
export type ContextValues<D extends ContextValueDependencies> = {
  [K in keyof D]: ContextValueOf<D[K]> | undefined
}

export type ContextIdOf<C> = C extends ContextValue<infer Id, any> ? Id : never
export type ContextValueOf<C> = C extends ContextValue<any, infer V> ? V : never

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

const GROUP_TYPE = 'makeswift::controls::group'
const SHAPE_TYPE = 'makeswift::controls::shape'
const LIST_TYPE = 'makeswift::controls::list'
const STYLE_V2_TYPE = 'makeswift::controls::style-v2'

type GroupType = typeof GROUP_TYPE
type ShapeType = typeof SHAPE_TYPE
type ListType = typeof LIST_TYPE
type StyleV2Type = typeof STYLE_V2_TYPE

type KeyedContainer = GroupType | ShapeType
type MultiValueContainer = ListType | StyleV2Type

type KeyDefsOf<Def> =
  ConfigType<Def> extends { props: infer R }
    ? R
    : ConfigType<Def> extends { type: infer R }
      ? R
      : never

type ItemDefOf<Def> = ConfigType<Def> extends { type: infer I } ? I : never

export type ProvidedIds<Def> = Def extends unknown
  ? ProvidedIdsImpl<Def>
  : never
type ProvidedIdsImpl<Def> =
  ControlType<Def> extends KeyedContainer
    ? {
        [K in keyof KeyDefsOf<Def>]: ProvidedIds<KeyDefsOf<Def>[K]>
      }[keyof KeyDefsOf<Def>]
    : ControlType<Def> extends MultiValueContainer
      ? never
      : ProvidedContextId<Def>

export type RequiredIds<Def> = Def extends unknown
  ? RequiredIdsImpl<Def>
  : never
type RequiredIdsImpl<Def> =
  ControlType<Def> extends KeyedContainer
    ? {
        [K in keyof KeyDefsOf<Def>]: RequiredIds<KeyDefsOf<Def>[K]>
      }[keyof KeyDefsOf<Def>]
    : ControlType<Def> extends MultiValueContainer
      ? RequiredIds<ItemDefOf<Def>>
      : ContextDependencyIds<Def>

/** Context ids provided under a multivalue container. */
export type MultiValueProvidedIds<Def> = Def extends unknown
  ? MultiValueProvidedIdsImpl<Def>
  : never
type MultiValueProvidedIdsImpl<Def> =
  ControlType<Def> extends KeyedContainer
    ? {
        [K in keyof KeyDefsOf<Def>]: MultiValueProvidedIds<KeyDefsOf<Def>[K]>
      }[keyof KeyDefsOf<Def>]
    : ControlType<Def> extends MultiValueContainer
      ? ProvidedIds<ItemDefOf<Def>> | MultiValueProvidedIds<ItemDefOf<Def>>
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
type MismatchedProvidedIdsOf<Def> =
  ControlType<Def> extends KeyedContainer
    ? {
        [K in keyof KeyDefsOf<Def>]: MismatchedProvidedIds<KeyDefsOf<Def>[K]>
      }[keyof KeyDefsOf<Def>]
    : ControlType<Def> extends MultiValueContainer
      ? MismatchedProvidedIds<ItemDefOf<Def>>
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
type DuplicateIdsWithinImpl<Def> =
  ControlType<Def> extends KeyedContainer
    ? DuplicateIds<KeyDefsOf<Def>>
    : ControlType<Def> extends MultiValueContainer
      ? // a provider in here is already a `ProviderInMultiValue` error
        DuplicateIdsWithin<ItemDefOf<Def>>
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
