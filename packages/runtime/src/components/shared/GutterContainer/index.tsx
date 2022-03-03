import styled, { css } from 'styled-components'

import { ResponsiveValue, Length } from '../../../prop-controllers/descriptors'
import { cssMediaRules } from '../../utils/cssMediaRules'

const GutterContainer = styled.div<{
  gutter?: ResponsiveValue<Length>
  first: boolean
  last: boolean
}>`
  ${p =>
    cssMediaRules(
      [p.gutter],
      ([gutter = { value: 0, unit: 'px' }]) => css`
        padding-left: ${p.first ? '0px' : `${gutter.value / 2}${gutter.unit}`};
        padding-right: ${p.last ? '0px' : `${gutter.value / 2}${gutter.unit}`};
      `,
    )}
`

export default GutterContainer
