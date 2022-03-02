import { css, CSSObject } from 'styled-components'
import {
  WidthProperty,
  MarginProperty,
  MarginTopProperty,
  MarginRightProperty,
  MarginBottomProperty,
  MarginLeftProperty,
  PaddingProperty,
  PaddingTopProperty,
  PaddingRightProperty,
  PaddingBottomProperty,
  PaddingLeftProperty,
  BorderRadiusProperty,
  BorderTopLeftRadiusProperty,
  BorderTopRightRadiusProperty,
  BorderBottomLeftRadiusProperty,
  BorderBottomRightRadiusProperty,
} from 'csstype'

import {
  ResponsiveValue,
  ResponsiveValueType as ExtractResponsiveValue,
  Length as LengthValue,
} from '../../prop-controllers'
import {
  FallbackStrategy,
  getDevice,
  getDeviceMediaQuery,
  join as joinResponsiveValues,
} from './devices'
import { getIndexes } from './columns'
import {
  BorderRadiusValue,
  MarginValue,
  PaddingValue,
  WidthValue,
} from '../../prop-controllers/descriptors'
import { colorToString } from './colorToString'
import {
  BorderSide,
  BorderPropControllerData,
  BoxShadowData,
  BoxShadowPropControllerData,
} from '../hooks'

type CSSRules = ReturnType<typeof css>

export function cssMediaRules<V, A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>, P>(
  responsiveValues: A | ((props: P) => A),
  join: (
    values: { [K in keyof A]: ExtractResponsiveValue<A[K]> | undefined },
  ) => CSSRules | CSSObject,
  strategy?: FallbackStrategy<V>,
): (props: P) => CSSRules {
  return props =>
    joinResponsiveValues(
      typeof responsiveValues === 'function' ? responsiveValues(props) : responsiveValues,
      join,
      strategy,
    ).reduce((acc, { deviceId, value }) => {
      const device = getDevice(deviceId)
      const mediaQuery = getDeviceMediaQuery(device)

      return css`
        ${acc}${mediaQuery} {
          ${value}
        }
      `
    }, css`` as CSSRules)
}

export function cssWidth(
  defaultValue: LengthValue | WidthProperty<string | number> = '100%',
): (props: { width?: WidthValue }) => CSSRules {
  return props => css`
    max-width: 100%;
    ${cssMediaRules(
      [props.width] as const,
      ([width = defaultValue]) => css`
        width: ${typeof width === 'object' ? `${width.value}${width.unit}` : width};
      `,
    )}
  `
}

function getMarginSide(marginSide: LengthValue | MarginProperty<string | number>) {
  return typeof marginSide === 'object' ? `${marginSide.value}${marginSide.unit}` : marginSide
}

export function cssMargin(
  defaultValue: {
    marginTop?: LengthValue | MarginTopProperty<string | number>
    marginRight?: LengthValue | MarginRightProperty<string | number>
    marginBottom?: LengthValue | MarginBottomProperty<string | number>
    marginLeft?: LengthValue | MarginLeftProperty<string | number>
  } = {},
): (props: { margin?: MarginValue }) => CSSRules {
  const defaultMarginTop = defaultValue.marginTop === undefined ? 0 : defaultValue.marginTop
  const defaultMarginRight =
    defaultValue.marginRight === undefined ? 'auto' : defaultValue.marginRight
  const defaultMarginBottom =
    defaultValue.marginBottom === undefined ? 0 : defaultValue.marginBottom
  const defaultMarginLeft = defaultValue.marginLeft === undefined ? 'auto' : defaultValue.marginLeft

  return props => css`
    ${cssMediaRules(
      [props.margin] as const,
      ([
        {
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
        } = {} as ExtractResponsiveValue<MarginValue>,
      ]) => css`
        margin-top: ${getMarginSide(marginTop || defaultMarginTop)};
        margin-right: ${getMarginSide(marginRight || defaultMarginRight)};
        margin-bottom: ${getMarginSide(marginBottom || defaultMarginBottom)};
        margin-left: ${getMarginSide(marginLeft || defaultMarginLeft)};
      `,
    )}
  `
}

function getPaddingSide(paddingSide: LengthValue | PaddingProperty<string | number>) {
  return typeof paddingSide === 'object' ? `${paddingSide.value}${paddingSide.unit}` : paddingSide
}

export function cssPadding(
  defaultValue: {
    paddingTop?: LengthValue | PaddingTopProperty<string | number>
    paddingRight?: LengthValue | PaddingRightProperty<string | number>
    paddingBottom?: LengthValue | PaddingBottomProperty<string | number>
    paddingLeft?: LengthValue | PaddingLeftProperty<string | number>
  } = {},
): (props: { padding?: PaddingValue }) => CSSRules {
  const defaultPaddingTop = defaultValue.paddingTop === undefined ? 0 : defaultValue.paddingTop
  const defaultPaddingRight =
    defaultValue.paddingRight === undefined ? 0 : defaultValue.paddingRight
  const defaultPaddingBottom =
    defaultValue.paddingBottom === undefined ? 0 : defaultValue.paddingBottom
  const defaultPaddingLeft = defaultValue.paddingLeft === undefined ? 0 : defaultValue.paddingLeft

  return props => css`
    ${cssMediaRules(
      [props.padding] as const,
      ([
        {
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
        } = {} as ExtractResponsiveValue<PaddingValue>,
      ]) => css`
        padding-top: ${getPaddingSide(paddingTop || defaultPaddingTop)};
        padding-right: ${getPaddingSide(paddingRight || defaultPaddingRight)};
        padding-bottom: ${getPaddingSide(paddingBottom || defaultPaddingBottom)};
        padding-left: ${getPaddingSide(paddingLeft || defaultPaddingLeft)};
      `,
    )}
  `
}

const defaultBorderSide = { width: 0, style: 'solid', color: null }

const getBorderSide = ({ width, style, color }: BorderSide) =>
  `${width != null ? width : 0}px ${style} ${color != null ? colorToString(color) : 'black'}`

export function cssBorder(
  defaultValue: {
    borderTop?: BorderSide
    borderRight?: BorderSide
    borderBottom?: BorderSide
    borderLeft?: BorderSide
  } = {},
): (props: { border?: BorderPropControllerData | null | undefined }) => CSSRules {
  const defaultBorderTop =
    defaultValue.borderTop === undefined ? defaultBorderSide : defaultValue.borderTop
  const defaultBorderRight =
    defaultValue.borderRight === undefined ? defaultBorderSide : defaultValue.borderRight
  const defaultBorderBottom =
    defaultValue.borderBottom === undefined ? defaultBorderSide : defaultValue.borderBottom
  const defaultBorderLeft =
    defaultValue.borderLeft === undefined ? defaultBorderSide : defaultValue.borderLeft

  return props => css`
    ${cssMediaRules(
      [props.border] as const,
      ([
        {
          borderTop,
          borderRight,
          borderBottom,
          borderLeft,
        } = {} as ExtractResponsiveValue<BorderPropControllerData>,
      ]) => css`
        border-top: ${getBorderSide(borderTop || defaultBorderTop)};
        border-right: ${getBorderSide(borderRight || defaultBorderRight)};
        border-bottom: ${getBorderSide(borderBottom || defaultBorderBottom)};
        border-left: ${getBorderSide(borderLeft || defaultBorderLeft)};
      `,
    )}
  `
}

function getBorderRadiusCorner(
  borderRadiusCorner: LengthValue | BorderRadiusProperty<string | number>,
) {
  return typeof borderRadiusCorner === 'object'
    ? `${borderRadiusCorner.value}${borderRadiusCorner.unit}`
    : borderRadiusCorner
}

export function cssBorderRadius(
  defaultValue: {
    borderTopLeftRadius?: LengthValue | BorderTopLeftRadiusProperty<string | number>
    borderTopRightRadius?: LengthValue | BorderTopRightRadiusProperty<string | number>
    borderBottomLeftRadius?: LengthValue | BorderBottomLeftRadiusProperty<string | number>
    borderBottomRightRadius?: LengthValue | BorderBottomRightRadiusProperty<string | number>
  } = {},
): (props: { borderRadius?: BorderRadiusValue }) => CSSRules {
  const defaultBorderTopLeftRadius =
    defaultValue.borderTopLeftRadius === undefined ? 0 : defaultValue.borderTopLeftRadius
  const defaultBorderTopRightRadius =
    defaultValue.borderTopRightRadius === undefined ? 0 : defaultValue.borderTopRightRadius
  const defaultPaddingBottom =
    defaultValue.borderBottomLeftRadius === undefined ? 0 : defaultValue.borderBottomLeftRadius
  const defaultPaddingLeft =
    defaultValue.borderBottomRightRadius === undefined ? 0 : defaultValue.borderBottomRightRadius

  return props => css`
    ${cssMediaRules(
      [props.borderRadius] as const,
      ([
        {
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
        } = {} as ExtractResponsiveValue<BorderRadiusValue>,
      ]) => css`
        border-top-left-radius: ${getBorderRadiusCorner(
          borderTopLeftRadius || defaultBorderTopLeftRadius,
        )};
        border-top-right-radius: ${getBorderRadiusCorner(
          borderTopRightRadius || defaultBorderTopRightRadius,
        )};
        border-bottom-left-radius: ${getBorderRadiusCorner(
          borderBottomLeftRadius || defaultPaddingBottom,
        )};
        border-bottom-right-radius: ${getBorderRadiusCorner(
          borderBottomRightRadius || defaultPaddingLeft,
        )};
      `,
    )}
  `
}

const getBoxShadow = (shadows: BoxShadowData) =>
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

export function cssBoxShadow(
  defaultValue: BoxShadowData = [],
): (props: { boxShadow?: BoxShadowPropControllerData | null | undefined }) => CSSRules {
  return props => css`
    ${cssMediaRules(
      [props.boxShadow] as const,
      ([boxShadow = defaultValue]) => css`
        box-shadow: ${getBoxShadow(boxShadow)};
      `,
    )}
  `
}

const floor = (d: number) => (v: number): number => Math.floor(10 ** d * v) / 10 ** d

export function cssGridItem(): (props: {
  grid: ResponsiveValue<{ spans: Array<Array<number>>; count: number }>
  index: number
  columnGap?: ResponsiveValue<LengthValue>
  rowGap?: ResponsiveValue<LengthValue>
}) => CSSRules {
  return props => css`
    display: flex;

    /* TODO: A default span of 12 won't work once the column count is modifiable. */
    ${cssMediaRules(
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
    )}
  `
}
