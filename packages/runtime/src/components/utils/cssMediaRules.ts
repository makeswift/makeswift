import { css, CSSObject } from 'styled-components'

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
