import { z } from 'zod'

import { StableValue } from '../../lib/stable-value'
import { safeParse, type ParseResult } from '../../lib/zod'

import { type Data } from '../../common'
import { type CopyContext } from '../../context'
import { type IntrospectionTarget } from '../../introspection'
import { type ResourceResolver } from '../../resources/resolver'
import { type DeserializedRecord } from '../../serialization'
import { isFunction } from '../../serialization/function'
import { type Stylesheet } from '../../stylesheet'

import { type ResolvedValueType as ResolvedValueType_ } from '../associated-types'
import {
  ControlDefinition,
  type Resolvable,
  type SchemaType,
} from '../definition'
import { type SendMessage } from '../instance'
import { ControlDefinitionVisitor } from '../visitor'

import { CascadeControl } from './cascade-control'

type StepControl = ControlDefinition<string, unknown, any, any, any>

// A step produces a control from the previous step's ResolvedValue. Step 0
// takes no argument; step n (n>=1) takes step n-1's ResolvedValue. Inputs are
// author-annotated (loosely typed).
export type Step<D extends StepControl = StepControl> = (prev?: any) => D

export type Steps = readonly Step[]

type Config<S extends Steps = Steps> = {
  readonly label?: string
  readonly description?: string
  readonly steps: S
}

// Cascade Data/Value are arrays indexed by step; entry n is step n's control
// Data/Value. Loosely typed (elements are `Data`, matching `ControlDefinition`'s
// `DataType extends Data`/`ValueType extends Data` bounds) because the control
// at each step is materialized dynamically from upstream selections.
type DataType = Data[]
type ValueType = Data[]

// The last step's control (the return type of the last factory) drives the
// cascade's ResolvedValue.
type LastStep<S extends Steps> = S extends readonly [...any[], infer L]
  ? L extends Step
    ? L
    : never
  : Step

type ResolvedValueType<S extends Steps> =
  | ResolvedValueType_<ReturnType<LastStep<S>>>
  | undefined

type InstanceType<S extends Steps> = CascadeControl<Definition<S>>

// Stub resolver/stylesheet for the data-shaping methods (fromData/toData/
// copyData), which must materialize the chain to know each step's control but
// receive no resolver. Valid for the spike because the proven stage controls
// (Checkbox, Combobox) resolve synchronously and ignore both.
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

    if (isFunction(steps)) {
      return new CascadeDefinition({
        label: (data.config as { label?: string }).label,
        description: (data.config as { description?: string }).description,
        // Builder-side-only shape: a single callable "materialize chain"
        // function, not an array of step factories. This instance is never
        // used for fromData/toData/resolveValue (runtime-only concerns) —
        // only the builder's cascade controller calls `.steps` as a function.
        steps: steps as unknown as Steps,
      })
    }

    throw new Error(
      'unstable_Cascade: serialization is not yet supported (deferred to the builder-integration follow-up)',
    )
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
      // Spike: steps are factory functions, not statically schematizable.
      steps: z.array(z.any()),
    })

    const definition = z.object({ type, config })

    return { type, data, value, resolvedValue, definition, version }
  }

  safeParse(data: unknown | undefined): ParseResult<DataType | undefined> {
    return safeParse(this.schema.data, data)
  }

  // Walk the reachable step chain: build each step's control from the previous
  // step's ResolvedValue, run `visitStep` to collect an entry, and thread that
  // step's ResolvedValue into the next factory. Stops before a step whose
  // predecessor resolved to `undefined`.
  private walkSteps<T>(
    visitStep: (
      control: StepControl,
      index: number,
    ) => { entry: T; resolvedValue: unknown },
  ): T[] {
    const entries: T[] = []
    let prev: unknown = undefined
    for (let i = 0; i < this.config.steps.length; i++) {
      if (i > 0 && prev === undefined) break
      const control = this.config.steps[i](prev)
      const { entry, resolvedValue } = visitStep(control, i)
      entries.push(entry)
      prev = resolvedValue
    }
    return entries
  }

  // Walk the reachable chain from Data: for each step, build its control from
  // the previous step's ResolvedValue, then compute this step's Resolvable.
  // Stops before a step whose predecessor resolved to `undefined`.
  private materialize(
    data: DataType | undefined,
    resolver: ResourceResolver,
    stylesheet: Stylesheet,
  ): Array<{ control: StepControl; resolvable: Resolvable<unknown> }> {
    return this.walkSteps((control, i) => {
      const resolvable = control.resolveValue(
        data?.[i],
        resolver,
        stylesheet.child(String(i)),
      )
      return {
        entry: { control, resolvable },
        resolvedValue: resolvable.readStable(),
      }
      // why do we need to accumulate all the entries, why can't we just read the last value?
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
        // Deepest step with a defined resolved value = the "last selected"
        // step. Terminated/unselected downstream steps read `undefined`.
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
