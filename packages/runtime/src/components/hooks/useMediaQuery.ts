/* eslint-env browser */

import { useState } from 'react'

import { DeviceOverride } from '../../prop-controllers'
import { DEVICES, findDeviceOverride, getDeviceMediaQuery } from '../utils/devices'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export function useMediaQuery<S>(responsiveValue?: Array<DeviceOverride<S>>): S | void {
  const [deviceId, setDeviceId] = useState(DEVICES[0].id)
  const { value } = findDeviceOverride(responsiveValue, deviceId) || {}

  useIsomorphicLayoutEffect(() => {
    if (responsiveValue == null || window == null) return () => {}

    const cleanUpFns = DEVICES.map(device => {
      const mediaQueryList = window.matchMedia(getDeviceMediaQuery(device).replace('@media', ''))

      const listener = () => {
        if (mediaQueryList.matches) setDeviceId(device.id)
      }

      listener()
      mediaQueryList.addListener(listener)

      return () => mediaQueryList.removeListener(listener)
    })

    return () => cleanUpFns.forEach(fn => fn())
  })

  return value
}
