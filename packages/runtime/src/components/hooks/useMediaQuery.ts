import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { DeviceOverride } from '../../prop-controllers'
import { DEVICES, findDeviceOverride, getDeviceMediaQuery } from '../utils/devices'

const DEVICE_QUERIES = DEVICES.map(device => ({
  id: device.id,
  query: getDeviceMediaQuery(device).replace('@media', ''),
}))

function subscribe(notify: () => void) {
  const cleanUpFns = DEVICE_QUERIES.map(q => {
    const mediaQueryList = window.matchMedia(q.query)
    mediaQueryList.addEventListener('change', notify)
    return () => mediaQueryList.removeEventListener('change', notify)
  })
  return () => cleanUpFns.forEach(fn => fn())
}

export function useMediaQuery<S>(responsiveValue?: Array<DeviceOverride<S>>): S | undefined {
  const getServerSnapshot = () => findDeviceOverride(responsiveValue, DEVICES[0].id)?.value

  function getSnapshot() {
    const deviceId: string = DEVICE_QUERIES.reduce((matchedDevice, deviceQueries) => {
      if (window.matchMedia(deviceQueries.query).matches) {
        return deviceQueries.id
      }
      return matchedDevice
    }, DEVICE_QUERIES[0].id)
    return findDeviceOverride(responsiveValue, deviceId)?.value
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
