import { z } from 'zod'

import { isNotNil } from '../../lib/functional'

import { findBreakpointOverride, type Breakpoints } from '../../breakpoints'
import { type DeviceOverride } from '../../common'

import * as Schema from './schema'

export type ResolvedStyle = z.infer<typeof Schema.resolvedStyle>

export function mergeStyles(
  source: ResolvedStyle,
  override: ResolvedStyle,
  breakpoints: Breakpoints,
): ResolvedStyle {
  const getDeviceId = ({ deviceId }: DeviceOverride<unknown>) => deviceId
  const devices = [
    ...new Set([...source.map(getDeviceId), ...override.map(getDeviceId)]),
  ]

  return devices
    .map((deviceId) => {
      const deviceSource = findBreakpointOverride(
        breakpoints,
        source,
        deviceId,
      )?.value

      const deviceOverride = findBreakpointOverride(
        breakpoints,
        override,
        deviceId,
        (v) => v,
      )?.value

      if (deviceSource && deviceOverride) {
        return {
          deviceId,
          value: { ...deviceSource, ...deviceOverride },
        }
      }

      if (deviceOverride) {
        return {
          deviceId,
          value: deviceOverride,
        }
      }

      if (deviceSource) {
        return {
          deviceId,
          value: deviceSource,
        }
      }

      return null
    })
    .filter(isNotNil)
}
