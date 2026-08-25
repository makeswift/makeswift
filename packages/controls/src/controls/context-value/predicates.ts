import * as Schema from './schemas'
import type {
  AnyContextValue,
  ContextValue,
  ContextValueDependencies,
  DependsOnConfig,
  ProvidesConfig,
} from './types'

export function isContextValue(val: unknown): val is ContextValue {
  return Schema.contextValue.safeParse(val).success
}

export function isProvidesConfig<T>(
  config: T,
): config is T & Required<ProvidesConfig<AnyContextValue>> {
  return (
    typeof config === 'object' &&
    config != null &&
    'provides' in config &&
    Schema.provides.safeParse(config.provides).success
  )
}

export function isDependsOnConfig<T>(
  config: T,
): config is T & Required<DependsOnConfig<ContextValueDependencies>> {
  return (
    typeof config === 'object' &&
    config != null &&
    'dependsOn' in config &&
    Schema.dependsOn.safeParse(config.dependsOn).success
  )
}
