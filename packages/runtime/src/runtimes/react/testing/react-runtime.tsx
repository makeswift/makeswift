import { TestOrigins } from '../../../testing/fixtures'
import { ReactRuntime } from '../react-runtime'

export function createReactRuntime() {
  return new ReactRuntime({ fetch, ...TestOrigins })
}
