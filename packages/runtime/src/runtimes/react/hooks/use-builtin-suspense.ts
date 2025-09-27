import { useComponentMeta } from './use-component'

export function useBuiltinSuspense(type: string): boolean {
  const { builtinSuspense } = useComponentMeta(type) ?? {}
  return builtinSuspense ?? true
}
