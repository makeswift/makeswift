import styled, { createGlobalStyle } from 'styled-components'
import { normalize } from 'polished'
import { forwardRef, Ref } from 'react'

import Placeholder from './components/Placeholder'
import {
  GridValue,
  BackgroundsValue,
  GapXValue,
  GapYValue,
} from '../../prop-controllers/descriptors'
import { Element } from '../../react'
import { cssGridItem } from '../utils/cssMediaRules'

const Normalize = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  ${normalize()}
`

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`

const GridItem = styled.div`
  display: flex;
  align-items: flex-start;
  ${cssGridItem()}
`

type Props = {
  children?: GridValue
  backgrounds?: BackgroundsValue
  rowGap?: GapYValue
  columnGap?: GapXValue
}

export default forwardRef(function Page(
  { children, rowGap, columnGap }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <>
      <Normalize />
      <Grid ref={ref}>
        {children && children.elements.length > 0 ? (
          children.elements.map((child, index) => (
            <GridItem
              key={child.key}
              grid={children.columns}
              index={index}
              columnGap={columnGap}
              rowGap={rowGap}
            >
              <Element element={child} />
            </GridItem>
          ))
        ) : (
          <Placeholder />
        )}
      </Grid>
    </>
  )
})
