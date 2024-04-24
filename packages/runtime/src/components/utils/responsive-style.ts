import { WidthProperty } from 'csstype'
import { CSSObject } from '@emotion/css'
import type {
  ResponsiveValueType as ExtractResponsiveValue,
  LengthData,
  ResponsiveBorderRadiusData,
  ResponsiveMarginData,
  ResponsivePaddingData,
  ResponsiveValue,
  ResponsiveLengthData,
  ResponsiveTextStyleData,
} from '@makeswift/prop-controllers'

import {
  FallbackStrategy,
  getBreakpoint,
  getBreakpointMediaQuery,
  join as joinResponsiveValues,
  Breakpoints,
} from '../../state/modules/breakpoints'
import { getIndexes } from './columns'
import { PaddingPropertyData, paddingPropertyDataToStyle } from '../../css/padding'
import { MarginPropertyData, marginPropertyDataToStyle } from '../../css/margin'
import { BorderRadiusPropertyData, borderRadiusPropertyDataToStyle } from '../../css/border-radius'
import { BorderPropertyData, borderPropertyDataToStyle } from '../../css/border'
import { BorderPropControllerData } from '../hooks/useBorder'
import { colorToString } from './colorToString'
import { BoxShadow, ResponsiveBoxShadow } from '../hooks'
import { useBreakpoints } from '../../runtimes/react'
import { DropFirst } from './drop-first'

export function responsiveStyle<V, A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>>(
  breakpoints: Breakpoints,
  responsiveValues: A,
  join: (values: { [K in keyof A]: ExtractResponsiveValue<A[K]> | undefined }) => CSSObject,
  strategy?: FallbackStrategy<V>,
): CSSObject {
  return joinResponsiveValues(breakpoints, responsiveValues, join, strategy).reduce(
    (acc, { deviceId, value }) => {
      const breakpoint = getBreakpoint(breakpoints, deviceId)
      const mediaQuery = getBreakpointMediaQuery(breakpoint)

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

export function useResponsiveStyle<
  V,
  A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>,
>(
  responsiveValues: A,
  join: (values: { [K in keyof A]: ExtractResponsiveValue<A[K]> | undefined }) => CSSObject,
  strategy?: FallbackStrategy<V>,
): CSSObject {
  return responsiveStyle(useBreakpoints(), responsiveValues, join, strategy)
}

export function responsiveWidth(
  breakpoints: Breakpoints,
  widthData: ResponsiveLengthData | undefined,
  defaultValue: LengthData | WidthProperty<string | number> = '100%',
): CSSObject {
  return {
    maxWidth: '100%',
    ...responsiveStyle(breakpoints, [widthData], ([width = defaultValue]) => ({
      width: typeof width === 'object' ? `${width.value}${width.unit}` : width,
    })),
  }
}

export function useResponsiveWidth(
  ...args: DropFirst<Parameters<typeof responsiveWidth>>
): CSSObject {
  return responsiveWidth(useBreakpoints(), ...args)
}

export function responsivePadding(
  breakpoints: Breakpoints,
  paddingData: ResponsivePaddingData | undefined,
  defaultValue: PaddingPropertyData = {} as PaddingPropertyData,
): CSSObject {
  return responsiveStyle(breakpoints, [paddingData], ([padding = {} as PaddingPropertyData]) =>
    paddingPropertyDataToStyle(
      padding,
      Object.assign(
        { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
        defaultValue,
      ),
    ),
  )
}

export function useResponsivePadding(
  ...args: DropFirst<Parameters<typeof responsivePadding>>
): CSSObject {
  return responsivePadding(useBreakpoints(), ...args)
}

export function responsiveMargin(
  breakpoints: Breakpoints,
  marginData: ResponsiveMarginData | undefined,
  defaultValue: MarginPropertyData = {} as MarginPropertyData,
): CSSObject {
  return responsiveStyle(breakpoints, [marginData], ([margin = {} as MarginPropertyData]) =>
    marginPropertyDataToStyle(
      margin,
      Object.assign(
        { marginTop: 0, marginRight: 'auto', marginBottom: 0, marginLeft: 'auto' },
        defaultValue,
      ),
    ),
  )
}

export function useResponsiveMargin(
  ...args: DropFirst<Parameters<typeof responsiveMargin>>
): CSSObject {
  return responsiveMargin(useBreakpoints(), ...args)
}

export function responsiveBorderRadius(
  breakpoints: Breakpoints,
  borderRadiusData: ResponsiveBorderRadiusData | undefined,
  defaultValue: BorderRadiusPropertyData = {} as BorderRadiusPropertyData,
): CSSObject {
  return responsiveStyle(breakpoints, [borderRadiusData], ([borderRadius = {}]) =>
    borderRadiusPropertyDataToStyle(
      borderRadius,
      Object.assign(
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        },
        defaultValue,
      ),
    ),
  )
}

export function useResponsiveBorderRadius(
  ...args: DropFirst<Parameters<typeof responsiveBorderRadius>>
): CSSObject {
  return responsiveBorderRadius(useBreakpoints(), ...args)
}

export function useResponsiveBorder(
  borderData: BorderPropControllerData | undefined,
  defaultValue: BorderPropertyData = {},
): CSSObject {
  return useResponsiveStyle([borderData], ([border = {}]) =>
    borderPropertyDataToStyle(
      border,
      Object.assign(
        {
          borderTop: '0px solid black',
          borderRight: '0px solid black',
          borderBottom: '0px solid black',
          borderLeft: '0px solid black',
        },
        defaultValue,
      ),
    ),
  )
}

const floor =
  (d: number) =>
  (v: number): number =>
    Math.floor(10 ** d * v) / 10 ** d

export function responsiveGridItem(
  breakpoints: Breakpoints,
  props: {
    grid: ResponsiveValue<{ spans: number[][]; count: number }>
    index: number
    columnGap?: ResponsiveValue<LengthData>
    rowGap?: ResponsiveValue<LengthData>
  },
): CSSObject {
  return {
    display: 'flex',
    ...responsiveStyle(
      breakpoints,
      [props.grid, props.columnGap, props.rowGap] as const,
      ([
        { spans, count } = { spans: [[12]], count: 12 },
        columnGap = { value: 0, unit: 'px' },
        rowGap = { value: 0, unit: 'px' },
      ]) => {
        const [rowIndex, columnIndex] = getIndexes(spans, props.index)
        const firstCol = columnIndex === 0
        const lastCol = columnIndex === spans[rowIndex].length - 1
        const span = spans[rowIndex][columnIndex]
        const fraction = floor(5)(span / count)
        const width = `${fraction} * (100% + ${columnGap.value}${columnGap.unit})`
        const excessWidth = `${Number(firstCol) + Number(lastCol)} * ${columnGap.value}${
          columnGap.unit
        } / 2`
        const iePrecisionError = '0.01px'
        const flexBasis = `calc(${width} - ${excessWidth} - ${iePrecisionError})`
        const firstRow = rowIndex === 0
        const lastRow = rowIndex === spans.length - 1

        return span === 0
          ? { display: 'none' }
          : {
              flexBasis,
              minWidth: flexBasis,
              // NOTE: IE11 width breaks without max width
              // https://github.com/philipwalton/flexbugs/issues/3
              maxWidth: flexBasis,
              paddingLeft: firstCol ? 0 : `${columnGap.value / 2}${columnGap.unit}`,
              paddingRight: lastCol ? 0 : `${columnGap.value / 2}${columnGap.unit}`,
              paddingTop: firstRow ? 0 : `${rowGap.value / 2}${rowGap.unit}`,
              paddingBottom: lastRow ? 0 : `${rowGap.value / 2}${rowGap.unit}`,
            }
      },
    ),
  }
}

export function useResponsiveGridItem(
  ...args: DropFirst<Parameters<typeof responsiveGridItem>>
): CSSObject {
  return responsiveGridItem(useBreakpoints(), ...args)
}

const getBoxShadow = (shadows: BoxShadow) =>
  shadows
    .map(
      ({ payload: { inset, offsetX, offsetY, blurRadius, spreadRadius, color } }) =>
        `${inset ? 'inset ' : ''}${offsetX.toFixed(1)}px ${offsetY.toFixed(
          1,
        )}px ${blurRadius}px ${spreadRadius}px ${
          color != null ? colorToString(color) : 'rgba(0,0,0,0.2)'
        }`,
    )
    .filter(Boolean)
    .join()

export function responsiveShadow(
  breakpoints: Breakpoints,
  value: ResponsiveBoxShadow | undefined,
): CSSObject {
  return responsiveStyle(breakpoints, [value], ([shadow = []]) => ({
    boxShadow: getBoxShadow(shadow),
  }))
}

export function useResponsiveShadow(
  ...args: DropFirst<Parameters<typeof responsiveShadow>>
): CSSObject {
  return responsiveShadow(useBreakpoints(), ...args)
}

export function responsiveTextStyle(
  breakpoints: Breakpoints,
  value: ResponsiveTextStyleData | undefined,
): CSSObject {
  return responsiveStyle(
    breakpoints,
    [value],
    ([
      textStyle = {
        fontFamily: null,
        letterSpacing: null,
        fontSize: null,
        fontWeight: null,
        textTransform: [],
        fontStyle: [],
      },
    ]) => {
      const {
        fontSize,
        fontWeight,
        fontStyle = [],
        textTransform = [],
        letterSpacing,
        fontFamily,
      } = textStyle

      return {
        ...(fontFamily == null ? {} : { fontFamily: `"${fontFamily}"` }),
        ...(fontWeight == null ? {} : { fontWeight }),
        ...(letterSpacing == null ? {} : { letterSpacing }),
        ...(fontSize == null ? {} : { fontSize: `${fontSize.value}${fontSize.unit}` }),
        ...(textTransform.includes('uppercase') ? { textTransform: 'uppercase' } : {}),
        ...(fontStyle.includes('italic') ? { fontStyle: 'italic' } : {}),
      }
    },
  )
}

export function useResponsiveTextStyle(
  ...args: DropFirst<Parameters<typeof responsiveTextStyle>>
): CSSObject {
  return responsiveTextStyle(useBreakpoints(), ...args)
}
