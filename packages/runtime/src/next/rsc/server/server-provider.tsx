import { NextRSCRuntime } from '../components/react-runtime'
import { setRuntime } from '../context/server'

type Props = {
  runtime: NextRSCRuntime
  children: React.ReactNode
}

export function NextRSCServerProvider({ runtime, children }: Props) {
  setRuntime(runtime)

  return children
}
