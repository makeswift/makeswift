import { NextRSCRuntime } from '../shared/react-runtime'
import { setRuntime } from './runtime'

type Props = {
  runtime: NextRSCRuntime
  children: React.ReactNode
}

export function NextRSCServerProvider({ runtime, children }: Props) {
  setRuntime(runtime)

  return children
}
