import { expectTypeOf } from 'expect-type'

import { Checkbox } from '../checkbox'
import { Combobox } from '../combobox'
import { unstable_Gallery } from '../gallery'
import { Group } from '../group'
import { List } from '../list'
import { Number } from '../number'
import { Shape } from '../shape/v1'

import { ContextValue } from '.'
import type {
  ContextDependencyIds,
  ContextValues,
  ContextValue as ContextValueType,
  DuplicateIds,
  MismatchedProvidedIds,
  MultiValueProvidedIds,
  PropsWithValidContextUsage,
  ProvidedContextId,
  ProvidedIds,
  RequiredIds,
} from './types'

const stateNameContext = ContextValue('stateName').withType<string>()
const zoomContext = ContextValue('zoom').withType<number>()

const stateCombobox = () =>
  Combobox({
    provides: stateNameContext,
    getOptions: (query: string) => [{ id: query, value: query, label: query }],
  })

const cityCombobox = () =>
  Combobox({
    dependsOn: { selectedState: stateNameContext },
    getOptions: (_query, _context) => [],
  })

describe('PropContext', () => {
  test('carries its id and value type', () => {
    expectTypeOf(stateNameContext).toEqualTypeOf<
      ContextValueType<'stateName', string>
    >()
    expectTypeOf(stateNameContext.id).toEqualTypeOf<'stateName'>()
  })

  test('ContextValues makes every value optional', () => {
    expectTypeOf<
      ContextValues<{
        selectedState: typeof stateNameContext
        zoom: typeof zoomContext
      }>
    >().toEqualTypeOf<{
      selectedState: string | undefined
      zoom: number | undefined
    }>()
  })
})

describe('Combobox inference', () => {
  test('infers the item type, the context and the provided context together', () => {
    const def = Combobox({
      provides: zoomContext,
      dependsOn: { selectedState: stateNameContext },
      getOptions(query, context) {
        expectTypeOf(query).toEqualTypeOf<string>()
        expectTypeOf(context).toEqualTypeOf<{
          selectedState: string | undefined
        }>()

        return [{ id: 'a', value: 1, label: 'one' }]
      },
    })

    // the item type still infers from the return type, unannotated
    expectTypeOf(def.config).toMatchTypeOf<{
      getOptions: (
        query: string,
        context: { selectedState: string | undefined },
      ) => { id: string; value: 1; label: string }[]
    }>()

    expectTypeOf<[ProvidedContextId<typeof def>]>().toEqualTypeOf<['zoom']>()
    expectTypeOf<[ContextDependencyIds<typeof def>]>().toEqualTypeOf<
      ['stateName']
    >()
  })

  test('dependsOn aliases are preserved and narrow the context', () => {
    Combobox({
      dependsOn: { s: stateNameContext, z: zoomContext },
      getOptions(_query, context) {
        expectTypeOf(context).toEqualTypeOf<{
          s: string | undefined
          z: number | undefined
        }>()
        return []
      },
    })
  })

  test('no dependsOn means an empty context', () => {
    const def = Combobox({
      getOptions: (query: string) => [
        { id: query, value: query, label: query },
      ],
    })

    expectTypeOf<[ContextDependencyIds<typeof def>]>().toEqualTypeOf<[never]>()
    expectTypeOf<[ProvidedContextId<typeof def>]>().toEqualTypeOf<[never]>()
  })

  test('Gallery infers the same way', () => {
    unstable_Gallery({
      dependsOn: { selectedState: stateNameContext },
      getOptions(context) {
        expectTypeOf(context).toEqualTypeOf<{
          selectedState: string | undefined
        }>()
        return { options: [] }
      },
    })
  })
})

describe('the prop-tree walk', () => {
  test('finds providers and consumers through a Group', () => {
    const group = Group({
      props: {
        stateName: stateCombobox(),
        nested: Group({ props: { cityName: cityCombobox() } }),
        noise: Checkbox(),
      },
    })

    expectTypeOf<[ProvidedIds<typeof group>]>().toEqualTypeOf<['stateName']>()
    expectTypeOf<[RequiredIds<typeof group>]>().toEqualTypeOf<['stateName']>()
    expectTypeOf<[MultiValueProvidedIds<typeof group>]>().toEqualTypeOf<
      [never]
    >()
  })

  test('finds them through a Shape', () => {
    const shape = Shape({
      type: { stateName: stateCombobox(), cityName: cityCombobox() },
    })

    expectTypeOf<[ProvidedIds<typeof shape>]>().toEqualTypeOf<['stateName']>()
    expectTypeOf<[RequiredIds<typeof shape>]>().toEqualTypeOf<['stateName']>()
  })

  test('distributes over a union of mixed control types', () => {
    // The walk branches on `ControlType<Def>`, not on a naked `Def`, so it needs
    // an explicit distribution wrapper. Without it this union — which is exactly
    // the shape of `P[keyof P]` — matches no branch and collapses to `never`.
    type Mixed =
      | ReturnType<typeof stateCombobox>
      | ReturnType<typeof Checkbox>
      | ReturnType<typeof cityCombobox>

    expectTypeOf<[ProvidedIds<Mixed>]>().toEqualTypeOf<['stateName']>()
    expectTypeOf<[RequiredIds<Mixed>]>().toEqualTypeOf<['stateName']>()
  })

  test('a consumer inside a List is allowed', () => {
    const list = List({ type: cityCombobox() })

    expectTypeOf<[RequiredIds<typeof list>]>().toEqualTypeOf<['stateName']>()
    expectTypeOf<[ProvidedIds<typeof list>]>().toEqualTypeOf<[never]>()
    expectTypeOf<[MultiValueProvidedIds<typeof list>]>().toEqualTypeOf<
      [never]
    >()
  })

  test('a provider inside a List is flagged, however deeply nested', () => {
    const shallow = List({ type: stateCombobox() })
    expectTypeOf<[ProvidedIds<typeof shallow>]>().toEqualTypeOf<[never]>()
    expectTypeOf<[MultiValueProvidedIds<typeof shallow>]>().toEqualTypeOf<
      ['stateName']
    >()

    const deep = List({
      type: Group({
        props: { inner: Group({ props: { s: stateCombobox() } }) },
      }),
    })
    expectTypeOf<[MultiValueProvidedIds<typeof deep>]>().toEqualTypeOf<
      ['stateName']
    >()
  })

  test('leaf controls contribute nothing', () => {
    expectTypeOf<[ProvidedIds<ReturnType<typeof Checkbox>>]>().toEqualTypeOf<
      [never]
    >()
    expectTypeOf<[RequiredIds<ReturnType<typeof Checkbox>>]>().toEqualTypeOf<
      [never]
    >()
  })

  test('flags a provider whose resolved value type does not match', () => {
    const ok = stateCombobox()
    expectTypeOf<[MismatchedProvidedIds<typeof ok>]>().toEqualTypeOf<[never]>()

    const bad = Combobox({
      provides: stateNameContext,
      getOptions: (_query: string) => [{ id: 'x', value: 1, label: 'one' }],
    })
    expectTypeOf<[MismatchedProvidedIds<typeof bad>]>().toEqualTypeOf<
      ['stateName']
    >()
  })
})

function register<P extends Record<string, unknown>>(
  _props: P & PropsWithValidContextUsage<P>,
): void {}

describe('component props validation', () => {
  test('accepts a provider and consumer as siblings', () => {
    register({ stateName: stateCombobox(), cityName: cityCombobox() })
  })

  test('accepts a consumer nested below a top-level provider', () => {
    register({
      stateName: stateCombobox(),
      details: Group({ props: { cityName: cityCombobox() } }),
    })
  })

  test('accepts a provider inside a Group consumed at the top level', () => {
    register({
      details: Group({ props: { stateName: stateCombobox() } }),
      cityName: cityCombobox(),
    })
  })

  test('accepts a consumer inside a List fed from outside it', () => {
    register({
      stateName: stateCombobox(),
      stops: List({ type: cityCombobox() }),
    })
  })

  test('rejects a consumer with no provider anywhere', () => {
    register({
      // @ts-expect-error — nothing provides `stateName`
      cityName: cityCombobox(),
      noise: Number({ defaultValue: 0 }),
    })
  })

  test('rejects a provider inside a List', () => {
    register({
      // @ts-expect-error — a List provider has one value per item
      stops: List({ type: stateCombobox() }),
      noise: Number({ defaultValue: 0 }),
    })
  })

  test('rejects a provider whose resolved value type does not match', () => {
    register({
      // @ts-expect-error — resolves to number, `stateName` accepts string
      stateName: Combobox({
        provides: stateNameContext,
        getOptions: (_query: string) => [{ id: 'x', value: 1, label: 'one' }],
      }),
    })
  })

  test('context-free props are unaffected', () => {
    register({
      toggle: Checkbox(),
      count: Number({ defaultValue: 0 }),
      plain: Combobox({
        getOptions: (q: string) => [{ id: q, value: q, label: q }],
      }),
    })
  })
})

describe('duplicate provider detection', () => {
  // A union can't hold a duplicate, so `DuplicateIds` compares siblings pairwise
  // rather than accumulating.

  test('is empty when every provider is distinct', () => {
    const zoomCombobox = Combobox({
      provides: zoomContext,
      getOptions: (_q: string) => [{ id: 'z', value: 1, label: 'z' }],
    })

    type P = { a: ReturnType<typeof stateCombobox>; b: typeof zoomCombobox }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<[never]>()
  })

  test('catches two sibling providers of the same id', () => {
    type P = {
      a: ReturnType<typeof stateCombobox>
      b: ReturnType<typeof stateCombobox>
    }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<['stateName']>()
  })

  test('catches a duplicate across nesting levels', () => {
    const group = Group({ props: { inner: stateCombobox() } })
    type P = { a: ReturnType<typeof stateCombobox>; b: typeof group }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<['stateName']>()
  })

  test('catches a duplicate wholly inside one prop', () => {
    const group = Group({
      props: { one: stateCombobox(), two: stateCombobox() },
    })
    type P = { g: typeof group }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<['stateName']>()
  })

  test('catches a duplicate between two separate groups', () => {
    const a = Group({ props: { x: stateCombobox() } })
    const b = Group({ props: { y: stateCombobox() } })
    type P = { a: typeof a; b: typeof b }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<['stateName']>()
  })

  test('a single provider has no siblings to clash with', () => {
    type P = { only: ReturnType<typeof stateCombobox> }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<[never]>()
  })

  test('providers inside a List are not counted — already a FanOutProvider error', () => {
    const list = List({ type: stateCombobox() })
    type P = { a: ReturnType<typeof stateCombobox>; b: typeof list }
    expectTypeOf<[DuplicateIds<P>]>().toEqualTypeOf<[never]>()
  })

  test('registerComponent rejects duplicate providers', () => {
    register({
      // @ts-expect-error — `stateName` is provided twice
      stateName: stateCombobox(),
      // @ts-expect-error — `stateName` is provided twice
      alsoStateName: stateCombobox(),
    })
  })
})

describe('namespaced contexts', () => {
  const Selector = <Ns extends string>(namespace: Ns) => {
    const generation = ContextValue(
      `${namespace}.generation`,
    ).withType<number>()
    const selection = ContextValue(`${namespace}.selection`).withType<string>()

    return Group({
      props: {
        generation: Combobox({
          provides: generation,
          getOptions: () => [{ id: '1', value: 1, label: '1' }],
        }),
        selection: Combobox({
          provides: selection,
          dependsOn: { generation },
          getOptions: (query, context) => {
            expectTypeOf(context).toEqualTypeOf<{
              generation: number | undefined
            }>()
            return [{ id: query, value: query, label: query }]
          },
        }),
      },
    })
  }

  test('a template-literal id stays literal, so prefixing gives distinct ids', () => {
    const generation = ContextValue(`primary.generation`).withType<number>()

    expectTypeOf(generation).toEqualTypeOf<
      ContextValueType<'primary.generation', number>
    >()
  })

  test('two instances of the same factory do not collide', () => {
    const pokemon = Selector('pokemon')
    const rival = Selector('rival')

    expectTypeOf<[ProvidedIds<typeof pokemon>]>().toEqualTypeOf<
      ['pokemon.generation' | 'pokemon.selection']
    >()
    expectTypeOf<[ProvidedIds<typeof rival>]>().toEqualTypeOf<
      ['rival.generation' | 'rival.selection']
    >()

    register({ pokemon, rival })
  })

  test('reusing a namespace is caught as a duplicate', () => {
    register({
      // @ts-expect-error — both instances provide `dup.*`
      a: Selector('dup'),
      // @ts-expect-error — both instances provide `dup.*`
      b: Selector('dup'),
    })
  })
})
