import { contextValueSchema, dependsOnSchema, providesSchema } from './schemas'
import type {
  AnyContextValue,
  ContextValue,
  ContextValueDependencies,
  DependsOnConfig,
  ProvidesConfig,
} from './types'

export function isContextValue(val: unknown): val is ContextValue {
  return contextValueSchema.safeParse(val).success
}

export function isProvidesConfig<T>(
  config: T,
): config is T & Required<ProvidesConfig<AnyContextValue>> {
  return (
    typeof config === 'object' &&
    config != null &&
    'provides' in config &&
    providesSchema.safeParse(config.provides).success
  )
}

export function isDependsOnConfig<T>(
  config: T,
): config is T & Required<DependsOnConfig<ContextValueDependencies>> {
  return (
    typeof config === 'object' &&
    config != null &&
    'dependsOn' in config &&
    dependsOnSchema.safeParse(config.dependsOn).success
  )
}
