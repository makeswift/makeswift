import { type ControlTraits } from './traits'

export class ControlTraitsRegistry {
  private readonly registry: Map<string, ControlTraits> = new Map()

  add<T extends ControlTraits>(controlTraits: T): T {
    this.registry.set(controlTraits.controlType, controlTraits)
    return controlTraits
  }

  get(controlType: string): ControlTraits | undefined {
    return this.registry.get(controlType)
  }
}

export const controlTraitsRegistry = new ControlTraitsRegistry()
