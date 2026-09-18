import { lazy, type ReactNode, type ComponentType } from 'react'

/**
 * Server component loader wrapper for RSC env; redirects to `React.lazy`.
 */
export function serverOnly<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(load)
}

/**
 * Server component loader wrapper for all other envs including SSR; ignores the
 * loader and returns a no-op component that should never be rendered.
 *
 * On the compilation side, the Vite plugin (`./plugin/index.ts`) uses the
 * `serverOnly` import as a marker for inline loaders whose server-only
 * imports need to be removed from non-RSC module graphs.
 */
export function serverOnlyNoOp<T extends ComponentType<any>>(_load: () => Promise<{ default: T }>) {
  return (): ReactNode => null
}
