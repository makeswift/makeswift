import { WidthProperty } from 'csstype'
import { CSSObject } from '@emotion/css'

import {
  ResponsiveValue,
  ResponsiveValueType as ExtractResponsiveValue,
  Length as LengthValue,
  WidthValue,
  PaddingValue,
} from '../../prop-controllers/descriptors'
import {
  FallbackStrategy,
  getDevice,
  getDeviceMediaQuery,
  join as joinResponsiveValues,
} from './devices'
import { PaddingPropertyData, paddingPropertyDataToStyle } from '../../css/padding'

export function responsiveStyle<V, A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>>(
  responsiveValues: A,
  join: (values: { [K in keyof A]: ExtractResponsiveValue<A[K]> | undefined }) => CSSObject,
  strategy?: FallbackStrategy<V>,
): CSSObject {
  return joinResponsiveValues(responsiveValues, join, strategy).reduce(
    (acc, { deviceId, value }) => {
      const device = getDevice(deviceId)
      const mediaQuery = getDeviceMediaQuery(device)

      return {
        ...acc,
        [mediaQuery]: {
          ...(acc[mediaQuery] as CSSObject),
          ...value,
        },
      }
    },
    {} as CSSObject,
  )
}

export function responsiveWidth(
  widthData: WidthValue | undefined,
  defaultValue: LengthValue | WidthProperty<string | number> = '100%',
): CSSObject {
  return {
    maxWidth: '100%',
    ...responsiveStyle([widthData], ([width = defaultValue]) => ({
      width: typeof width === 'object' ? `${width.value}${width.unit}` : width,
    })),
  }
}

export function responsivePadding(
  paddingData: PaddingValue | undefined,
  defaultValue: PaddingPropertyData = {} as PaddingPropertyData,
): CSSObject {
  return responsiveStyle([paddingData], ([padding = {} as PaddingPropertyData]) =>
    paddingPropertyDataToStyle(
      padding,
      Object.assign(
        { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
        defaultValue,
      ),
    ),
  )
}
