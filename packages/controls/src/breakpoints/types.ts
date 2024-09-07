import { type Device as DeviceId } from '../common/types'

export type BreakpointId = DeviceId

export type Breakpoint = {
  id: BreakpointId
  label?: string
  viewportWidth?: number
  minWidth?: number
  maxWidth?: number
}

export type Breakpoints = Breakpoint[]
