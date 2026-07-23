import { match } from 'ts-pattern'
import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { ControlDataTypeKey } from '../../common'
import { type CopyContext } from '../../context'
import { type IntrospectionTarget } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import { type DeserializedRecord } from '../../serialization'
import { isFunction } from '../../serialization/function'
import { type Stylesheet } from '../../stylesheet'

import {
  type DataType as DataType_,
  type ResolvedValueType as ResolvedValueType_,
  type ValueType as ValueType_,
} from '../associated-types'
import { CheckboxDefinition } from '../checkbox'
import { CodeDefinition } from '../code'
import { ComboboxDefinition } from '../combobox'
import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { unstable_GalleryDefinition } from '../gallery'
import { IconRadioGroupDefinition } from '../icon-radio-group'
import { type ControlInstanceArgs } from '../instance'
import { NumberDefinition } from '../number'
import { SelectDefinition } from '../select'
import { SliderDefinition } from '../slider'
import { TextAreaDefinition } from '../text-area'
import { TextInputDefinition } from '../text-input'
import { ControlDefinitionVisitor } from '../visitor'

import { CascadeControl } from './cascade-control'

type StepControl =
  | CheckboxDefinition<any>
  | CodeDefinition<any>
  | ComboboxDefinition<any>
  | unstable_GalleryDefinition<any>
  | IconRadioGroupDefinition<any>
  | NumberDefinition<any>
  | SelectDefinition<any>
  | SliderDefinition<any>
  | TextAreaDefinition<any>
  | TextInputDefinition<any>

type MaterializedStepControl = ControlDefinition<string, unknown, any, any, any>

const STEP_TYPES = [
  CheckboxDefinition.type,
  CodeDefinition.type,
  ComboboxDefinition.type,
  unstable_GalleryDefinition.type,
  IconRadioGroupDefinition.type,
  NumberDefinition.type,
  SelectDefinition.type,
  SliderDefinition.type,
  TextAreaDefinition.type,
  TextInputDefinition.type,
] as const

const COMPATIBLE_STEP_TYPES: ReadonlySet<string> = new Set(STEP_TYPES)

type MutuallyAssignable<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : false
  : false

type Assert<T extends true> = T

type _StepTypesMatchUnion = Assert<
  MutuallyAssignable<(typeof STEP_TYPES)[number], StepControl['controlType']>
>

export type { _StepTypesMatchUnion as __assertStepTypes }

export type Step<D extends StepControl = StepControl> = (prev?: any) => D

export type Steps = readonly Step[]

type Config<S extends Steps = Steps> = {
  readonly label?: string
  readonly description?: string
  readonly steps: S
}

type StepData = DataType_<StepControl> | undefined
type StepValue = ValueType_<StepControl> | undefined

type VersionedData = {
  [ControlDataTypeKey]: typeof Definition.v1DataType
  value: StepData[]
}
type DataType = StepData[] | VersionedData
type ValueType = StepValue[]

type LastStep<S extends Steps> = S extends readonly [...any[], infer L]
  ? L extends Step
    ? L
    : never
  : Step

type ResolvedValueType<S extends Steps> =
  | ResolvedValueType_<ReturnType<LastStep<S>>>
  | undefined

type InstanceType<S extends Steps> = CascadeControl<Definition<S>>

const NOOP_RESOLVER = {} as ResourceResolver
const NOOP_STYLESHEET: Stylesheet = {
  child: () => NOOP_STYLESHEET,
} as unknown as Stylesheet

class Definition<S extends Steps> extends ControlDefinition<
  typeof Definition.type,
  Config<S>,
  DataType,
  ValueType,
  ResolvedValueType<S>,
  InstanceType<S>
> {
  static readonly type = 'makeswift::controls::cascade' as const

  static readonly v1DataType = 'cascade::v1' as const
  static readonly dataSignature = {
    v1: { [ControlDataTypeKey]: this.v1DataType },
  } as const

  static deserialize(data: DeserializedRecord): CascadeDefinition {
    const steps = (data.config as { steps?: unknown } | undefined)?.steps

    if (!isFunction(steps)) {
      throw new Error(
        'unstable_Cascade: serialization is not yet supported (deferred to the builder-integration follow-up)',
      )
    }

    return new CascadeDefinition(
      {
        label: (data.config as { label?: string }).label,
        description: (data.config as { description?: string }).description,
        steps: steps as unknown as Steps,
      },
      (data as { version?: 1 }).version,
    )
  }

  static slots(data: DataType | undefined): StepData[] | undefined {
    return match(data)
      .with(Definition.dataSignature.v1, ({ value }) => value)
      .otherwise((value) => value)
  }

  constructor(
    config: Config<S>,
    readonly version?: 1,
  ) {
    super(config)
  }

  get steps(): S {
    return this.config.steps
  }

  get controlType() {
    return Definition.type
  }

  get schema() {
    const version = z.literal(1)
    const type = z.literal(Definition.type)

    const versionedData = z.object({
      [ControlDataTypeKey]: z.literal(Definition.v1DataType),
      value: z.array(z.any()),
    })

    const data = z.union([
      z.array(z.any()),
      versionedData,
    ]) as unknown as SchemaType<DataType>
    const value = z.array(z.any()) as unknown as SchemaType<ValueType>
    const resolvedValue = z.any() as unknown as SchemaType<ResolvedValueType<S>>

    const config = z.object({
      label: z.string().optional(),
      description: z.string().optional(),
      steps: z.array(z.any()),
    })

    const definition = z.object({ type, config })

    return { type, data, value, resolvedValue, definition, version }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.schema.data, data)
  }

  private walkSteps<T>(
    visitStep: (
      control: MaterializedStepControl,
      index: number,
    ) => { entry: T; resolvedValue: unknown },
  ): T[] {
    const entries: T[] = []
    let prev: unknown = undefined
    for (let i = 0; i < this.config.steps.length; i++) {
      if (i > 0 && prev === undefined) break
      const control: MaterializedStepControl = this.config.steps[i](prev)
      if (!COMPATIBLE_STEP_TYPES.has(control.controlType)) {
        throw new Error(
          `unstable_Cascade: step ${i} returned unsupported control ` +
            `'${control.controlType}' — Supported controls: ${STEP_TYPES.join(', ')}`,
        )
      }
      const { entry, resolvedValue } = visitStep(control, i)
      entries.push(entry)
      prev = resolvedValue
    }
    return entries
  }

  private materialize(
    slots: StepData[] | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    mode: 'strict' | 'lenient',
  ): Array<{
    control: MaterializedStepControl
    resolvable: Resolvable<unknown>
  }> {
    return this.walkSteps((control, i) => {
      let stepData = slots?.[i]
      if (stepData !== undefined) {
        const parsed = control.safeParse(stepData)
        if (!parsed.success) {
          const message =
            `unstable_Cascade: step ${i} data does not match control ` +
            `'${control.controlType}': ${parsed.error}`
          if (mode === 'strict') throw new Error(message)
          console.warn(message)
          stepData = undefined
        }
      }
      const resolvable = control.resolveValue(
        stepData,
        resolver,
        stylesheet.child(String(i)),
      )
      return {
        entry: { control, resolvable },
        resolvedValue: resolvable.readStable(),
      }
    })
  }

  materializeForSerialization(data: DataType | undefined): ControlDefinition[] {
    const slots = Definition.slots(data)
    return this.materialize(
      slots,
      NOOP_RESOLVER,
      NOOP_STYLESHEET,
      'lenient',
    ).map(({ control }) => control as unknown as ControlDefinition)
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    const slots = Definition.slots(data)
    if (slots == null) return undefined
    return this.materialize(
      slots,
      NOOP_RESOLVER,
      NOOP_STYLESHEET,
      'strict',
    ).map(({ control }, i) => control.fromData(slots[i]))
  }

  toData(value: ValueType): DataType {
    const slots = this.walkSteps((control, i) => {
      const data = control.toData(value[i])
      const resolvable = control.resolveValue(
        data,
        NOOP_RESOLVER,
        NOOP_STYLESHEET,
      )
      return { entry: data, resolvedValue: resolvable.readStable() }
    })
    return match(this.version)
      .with(1, () => ({ ...Definition.dataSignature.v1, value: slots }))
      .otherwise(() => slots)
  }

  copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined {
    const slots = Definition.slots(data)
    if (slots == null) return undefined
    return this.materialize(
      slots,
      NOOP_RESOLVER,
      NOOP_STYLESHEET,
      'strict',
    ).map(({ control }, i) => control.copyData(slots[i], context))
  }

  resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    _control?: InstanceType<S>,
  ): Resolvable<ResolvedValueType<S> | undefined> {
    const slots = Definition.slots(data)
    const chain = this.materialize(slots, resolver, stylesheet, 'lenient')
    const resolvables = chain.map((c) => c.resolvable)

    const stableValue = StableValue({
      name: Definition.type,
      read: () => {
        const lastStep = chain[this.config.steps.length - 1]
        return lastStep?.resolvable.readStable() as ResolvedValueType<S> | undefined
      },
      deps: resolvables,
    })

    return {
      ...stableValue,
      triggerResolve: async (_currentValue?: ResolvedValueType<S>) => {
        await Promise.all(resolvables.map((r) => r.triggerResolve()))
      },
    }
  }

  createInstance(args: ControlInstanceArgs): InstanceType<S> {
    return new CascadeControl(this, args)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitCascade(this, ...args)
  }

  introspect<R>(data: DataType | undefined, target: IntrospectionTarget<R>) {
    const slots = Definition.slots(data)
    if (slots == null) return []
    return this.materialize(
      slots,
      NOOP_RESOLVER,
      NOOP_STYLESHEET,
      'strict',
    ).flatMap(({ control }, i) => control.introspect(slots[i], target) ?? [])
  }
}

export class CascadeDefinition<S extends Steps = Steps> extends Definition<S> {}

export function unstable_Cascade<const S extends Steps>(
  config: Config<S>,
): CascadeDefinition<S> {
  return new CascadeDefinition<S>(config, 1)
}
