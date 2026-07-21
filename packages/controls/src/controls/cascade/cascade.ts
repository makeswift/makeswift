import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

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
import { IconRadioGroupDefinition } from '../icon-radio-group'
import { type SendMessage } from '../instance'
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
  | IconRadioGroupDefinition<any>
  | NumberDefinition<any>
  | SelectDefinition<any>
  | SliderDefinition<any>
  | TextAreaDefinition<any>
  | TextInputDefinition<any>

type MaterializedStepControl = ControlDefinition<string, unknown, any, any, any>

const COMPATIBLE_STEP_TYPES: ReadonlySet<string> = new Set([
  CheckboxDefinition.type,
  CodeDefinition.type,
  ComboboxDefinition.type,
  IconRadioGroupDefinition.type,
  NumberDefinition.type,
  SelectDefinition.type,
  SliderDefinition.type,
  TextAreaDefinition.type,
  TextInputDefinition.type,
])

export type Step<D extends StepControl = StepControl> = (prev?: any) => D

export type Steps = readonly Step[]

type Config<S extends Steps = Steps> = {
  readonly label?: string
  readonly description?: string
  readonly steps: S
}

type StepData = DataType_<StepControl> | undefined
type StepValue = ValueType_<StepControl> | undefined

type DataType = StepData[]
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

  static deserialize(data: DeserializedRecord): CascadeDefinition {
    const steps = (data.config as { steps?: unknown } | undefined)?.steps

    if (!isFunction(steps)) {
      throw new Error(
        'unstable_Cascade: serialization is not yet supported (deferred to the builder-integration follow-up)',
      )
    }

    return new CascadeDefinition({
      label: (data.config as { label?: string }).label,
      description: (data.config as { description?: string }).description,
      steps: steps as unknown as Steps,
    })
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

    const data = z.array(z.any()) as unknown as SchemaType<DataType>
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
            `'${control.controlType}' — Supported controls: ${[...COMPATIBLE_STEP_TYPES].join(', ')}`,
        )
      }
      const { entry, resolvedValue } = visitStep(control, i)
      entries.push(entry)
      prev = resolvedValue
    }
    return entries
  }

  private materialize(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
  ): Array<{
    control: MaterializedStepControl
    resolvable: Resolvable<unknown>
  }> {
    return this.walkSteps((control, i) => {
      const stepData = data?.[i]
      if (stepData !== undefined) {
        const parsed = control.safeParse(stepData)
        if (!parsed.success) {
          throw new Error(
            `unstable_Cascade: step ${i} data does not match control ` +
              `'${control.controlType}': ${parsed.error}`,
          )
        }
      }
      const resolvable = control.resolveValue(
        data?.[i],
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
    return this.materialize(data, NOOP_RESOLVER, NOOP_STYLESHEET).map(
      ({ control }) => control as unknown as ControlDefinition,
    )
  }

  fromData(data: DataType | undefined): ValueType | undefined {
    if (data == null) return undefined
    return this.materialize(data, NOOP_RESOLVER, NOOP_STYLESHEET).map(
      ({ control }, i) => control.fromData(data[i]),
    )
  }

  toData(value: ValueType): DataType {
    return this.walkSteps((control, i) => {
      const data = control.toData(value[i])
      const resolvable = control.resolveValue(
        data,
        NOOP_RESOLVER,
        NOOP_STYLESHEET,
      )
      return { entry: data, resolvedValue: resolvable.readStable() }
    })
  }

  copyData(
    data: DataType | undefined,
    context: CopyContext,
  ): DataType | undefined {
    if (data == null) return undefined
    return this.materialize(data, NOOP_RESOLVER, NOOP_STYLESHEET).map(
      ({ control }, i) => control.copyData(data[i], context),
    )
  }

  resolveValue(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
    _control?: InstanceType<S>,
  ): Resolvable<ResolvedValueType<S> | undefined> {
    const chain = this.materialize(data, resolver, stylesheet)
    const resolvables = chain.map((c) => c.resolvable)

    const stableValue = StableValue({
      name: Definition.type,
      read: () => {
        for (let i = chain.length - 1; i >= 0; i--) {
          const rv = chain[i].resolvable.readStable()
          if (rv !== undefined) return rv as ResolvedValueType<S>
        }
        return undefined
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

  createInstance(sendMessage: SendMessage): InstanceType<S> {
    return new CascadeControl(this, sendMessage)
  }

  accept<R>(visitor: ControlDefinitionVisitor<R>, ...args: unknown[]): R {
    return visitor.visitCascade(this, ...args)
  }

  introspect<R>(data: DataType | undefined, target: IntrospectionTarget<R>) {
    if (data == null) return []
    return this.materialize(data, NOOP_RESOLVER, NOOP_STYLESHEET).flatMap(
      ({ control }, i) => control.introspect(data[i], target) ?? [],
    )
  }
}

export class CascadeDefinition<S extends Steps = Steps> extends Definition<S> {}

export function unstable_Cascade<const S extends Steps>(
  config: Config<S>,
): CascadeDefinition<S> {
  return new CascadeDefinition<S>(config)
}
