import { ControlDataTypeKey } from '../../common'
import { type ResourceResolver } from '../../resources/resolver'
import { type Stylesheet } from '../../stylesheet'

import { Checkbox } from '../checkbox'
import { Color } from '../color'
import { Combobox } from '../combobox'
import { Image } from '../image'

import { unstable_Cascade, CascadeDefinition, type Step } from './cascade'

// Checkbox/Combobox resolveValue ignore resolver/stylesheet, so stubs are safe.
const resolver = {} as ResourceResolver
const stylesheet = { child: () => stylesheet } as unknown as Stylesheet

const optionP1 = { id: 'p1', label: 'Product 1', value: { id: 'p1' } }
const optionV1 = { id: 'v1', label: 'Variant 1', value: { id: 'v1' } }

describe('unstable_Cascade (steps as control factories)', () => {
  test('exposes the cascade control type', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    expect(cascade.controlType).toBe(CascadeDefinition.type)
    expect(CascadeDefinition.type).toBe('makeswift::controls::cascade')
  })

  test('toData emits cascade::v1 tagged data', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    const data = cascade.toData([true])
    expect(data).toEqual({
      [ControlDataTypeKey]: 'cascade::v1',
      value: [Checkbox().toData(true)],
    })
  })

  test('fromData reads both v0 arrays and v1 tagged data', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    const v0 = [Checkbox().toData(true)]
    expect(cascade.fromData(v0)).toEqual([true])
    expect(
      cascade.fromData({ [ControlDataTypeKey]: 'cascade::v1', value: v0 }),
    ).toEqual([true])
  })

  test('threads step 0 resolved value into the step 1 factory', () => {
    const received: unknown[] = []
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: true }),
        (showDiscounts: boolean) => {
          received.push(showDiscounts)
          return Combobox({ getOptions: async () => [] })
        },
      ],
    })
    cascade.resolveValue([], resolver, stylesheet).readStable()
    expect(received).toEqual([true])
  })

  test('threads a combobox selection (option value) into the next factory', () => {
    const received: unknown[] = []
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (product: { id: string }) => {
          received.push(product)
          return Combobox({ getOptions: async () => [] })
        },
      ],
    })
    cascade.resolveValue([optionP1], resolver, stylesheet).readStable()
    expect(received).toEqual([{ id: 'p1' }])
  })

  test('fromData → toData round-trips through the materialized chain', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: false }),
        (_showDiscounts: boolean) => Combobox({ getOptions: async () => [] }),
      ],
    })
    const data = [Checkbox({ defaultValue: false }).toData(true), optionP1]
    const value = cascade.fromData(data)
    expect(cascade.toData(value!)).toEqual({
      [ControlDataTypeKey]: 'cascade::v1',
      value: data,
    })
  })

  test('copyData delegates to each materialized child', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: false }),
        (_s: boolean) => Combobox({ getOptions: async () => [] }),
      ],
    })
    const data = [Checkbox({ defaultValue: false }).toData(true), optionP1]
    const copied = cascade.copyData(data, { replacementContext: {} } as any)
    expect(copied).toEqual(data)
  })

  test('resolveValue returns the deepest step with a defined value', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })
    expect(
      cascade.resolveValue([optionP1, optionV1], resolver, stylesheet).readStable(),
    ).toEqual({ id: 'v1' })
  })

  test('an unselected step terminates the chain (resolves to last selected)', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })
    // product selected, variant not → resolves to product's value
    expect(
      cascade.resolveValue([optionP1], resolver, stylesheet).readStable(),
    ).toEqual({ id: 'p1' })
  })

  test('resolveValue is undefined when step 0 is unselected', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })
    expect(
      cascade.resolveValue([], resolver, stylesheet).readStable(),
    ).toBeUndefined()
  })

  test('type: cascade ResolvedValue matches the last step control', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: unknown) => Checkbox({ defaultValue: false }),
      ] as const,
    })
    const rv = cascade.resolveValue([], resolver, stylesheet).readStable()
    // Last step is Checkbox → ResolvedValue is boolean | undefined.
    const typed: boolean | undefined = rv
    expect(typed).toBeUndefined()
  })

  test('deserialize accepts the live materialize-chain shape (a function)', () => {
    const materializeChain = async (_data: unknown[]) => []
    const cascade = CascadeDefinition.deserialize({
      type: CascadeDefinition.type,
      config: { label: 'Product', steps: materializeChain },
    } as any)

    expect(cascade.controlType).toBe(CascadeDefinition.type)
    expect(cascade.config.label).toBe('Product')
  })

  test('deserialize still throws for a detached record with no live port', () => {
    expect(() =>
      CascadeDefinition.deserialize({
        type: CascadeDefinition.type,
        config: { steps: [] },
      } as any),
    ).toThrow(/not yet supported/i)
  })

  test('toData threads the correct prev into the downstream factory (round-trip)', () => {
    const received: unknown[] = []
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: false }),
        (showDiscounts: boolean) => {
          received.push(showDiscounts)
          return Combobox({ getOptions: async () => [] })
        },
      ],
    })
    const data = [Checkbox({ defaultValue: false }).toData(true), optionP1]
    const value = cascade.fromData(data)
    received.length = 0 // ignore the fromData materialization; measure toData
    const roundTripped = cascade.toData(value!)
    expect(roundTripped).toEqual({
      [ControlDataTypeKey]: 'cascade::v1',
      value: data,
    })
    expect(received).toEqual([true]) // toData's walk threaded checkbox=true into step 1
  })

  test('a populated downstream with an unselected upstream stays terminated', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })
    // step 0 unselected but step 1 has data → chain terminates at step 0 → undefined
    expect(
      cascade.resolveValue([undefined, optionV1], resolver, stylesheet).readStable(),
    ).toBeUndefined()
  })

  test('materializeForSerialization returns the reachable chain of controls', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: true }),
        (showDiscounts: boolean) => {
          expect(showDiscounts).toBe(true)
          return Combobox({ getOptions: async () => [] })
        },
      ],
    })
    const controls = cascade.materializeForSerialization([])
    expect(controls).toHaveLength(2)
    expect(controls[0].controlType).toBe('makeswift::controls::checkbox')
    expect(controls[1].controlType).toBe('makeswift::controls::combobox')
  })

  test('materializeForSerialization stops at an unselected step', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })
    const controls = cascade.materializeForSerialization([])
    expect(controls).toHaveLength(1)
  })
})

describe('step-control allowlist', () => {
  const colorStep = (() => Color()) as unknown as Step

  test('resolveValue degrades an invalid slot to undefined instead of throwing', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const cascade = unstable_Cascade({
      steps: [
        () => Combobox({ getOptions: async () => [] }),
        (_p: { id: string }) => Combobox({ getOptions: async () => [] }),
      ],
    })
    // valid product, garbage variant slot → resolves to the product (deepest defined)
    expect(
      cascade
        .resolveValue([optionP1, true as never], resolver, stylesheet)
        .readStable(),
    ).toEqual({ id: 'p1' })
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('step 1 data does not match control'),
    )
    warn.mockRestore()
  })

  test('materializeForSerialization is also lenient', () => {
    const cascade = unstable_Cascade({
      steps: [() => Checkbox({ defaultValue: true })],
    })
    expect(() =>
      cascade.materializeForSerialization([optionP1 as never]),
    ).not.toThrow()
  })

  test('fromData stays strict', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    expect(() => cascade.fromData([optionP1])).toThrow(
      /step 0 data does not match control/,
    )
  })

  test('fromData throws a descriptive error for an unsupported step control', () => {
    const cascade = unstable_Cascade({ steps: [colorStep] })
    expect(() => cascade.fromData([undefined])).toThrow(
      "unstable_Cascade: step 0 returned unsupported control 'makeswift::controls::color'",
    )
  })

  test('resolveValue throws the same error', () => {
    const cascade = unstable_Cascade({ steps: [colorStep] })
    expect(() =>
      cascade.resolveValue([undefined], resolver, stylesheet),
    ).toThrow(/returned unsupported control/)
  })

  test('the error names the supported control types', () => {
    const cascade = unstable_Cascade({ steps: [colorStep] })
    expect(() => cascade.toData([undefined])).toThrow(
      /Supported controls: .*makeswift::controls::checkbox.*makeswift::controls::combobox/,
    )
  })

  test('rejects Image, including as a downstream step', () => {
    const cascade = unstable_Cascade({
      steps: [
        () => Checkbox({ defaultValue: true }),
        (() => Image()) as unknown as Step,
      ],
    })
    expect(() => cascade.fromData([])).toThrow(
      "unstable_Cascade: step 1 returned unsupported control 'makeswift::controls::image'",
    )
  })

  test('type-level: slots only accept allowed-control data shapes', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    expect(() =>
      // @ts-expect-error — not a data shape of any allowed step control
      cascade.fromData([{ random: 'object' }]),
    ).toThrow(/step 0 data does not match/)
  })

  test('throws when a slot’s data does not match its step control', () => {
    const cascade = unstable_Cascade({ steps: [() => Checkbox()] })
    expect(() => cascade.fromData([optionP1])).toThrow(
      /step 0 data does not match control 'makeswift::controls::checkbox'/,
    )
  })

  test('type-level: rejects steps that return unsupported controls', () => {
    expect(() =>
      unstable_Cascade({
        steps: [
          // @ts-expect-error — Color is not a cascade-compatible step control
          () => Color(),
        ],
      }),
    ).not.toThrow()
  })
})
