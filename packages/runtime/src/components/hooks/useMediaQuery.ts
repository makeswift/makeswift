/* eslint-env browser */

import { useState, useLayoutEffect } from 'react'

import { DeviceOverride } from '../../prop-controllers'
import { DEVICES, findDeviceOverride, getDeviceMediaQuery } from '../utils/devices'

export function useMediaQuery<S>(responsiveValue?: Array<DeviceOverride<S>>): S | void {
  const [deviceId, setDeviceId] = useState(DEVICES[0].id)
  const { value } = findDeviceOverride(responsiveValue, deviceId) || {}

  useLayoutEffect(() => {
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
