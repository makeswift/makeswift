import { type BreakpointsInput } from '../../../state/modules/breakpoints'
import { TestOrigins } from '../../../testing/fixtures'
import { ReactRuntime } from '../react-runtime'

export function createReactRuntime({ breakpoints }: { breakpoints?: BreakpointsInput } = {}) {
  return new ReactRuntime({ fetch, breakpoints, ...TestOrigins })
}
