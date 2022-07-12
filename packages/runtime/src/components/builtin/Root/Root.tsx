import styled, { createGlobalStyle } from 'styled-components'
import { normalize } from 'polished'
import { forwardRef, Ref } from 'react'

import Placeholder from './components/Placeholder'
import {
  GridValue,
  BackgroundsValue,
  GapXValue,
  GapYValue,
} from '../../../prop-controllers/descriptors'
import { Element } from '../../../runtimes/react'
import { cssGridItem } from '../../utils/cssMediaRules'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import { Props } from '../../../prop-controllers'

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

const GridItem = styled.div.withConfig({
  shouldForwardProp: prop => !['grid', 'index', 'rowGap', 'columnGap'].includes(prop.toString()),
})`
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

const Root = forwardRef(function Page(
  { children, backgrounds, rowGap, columnGap }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <>
      <Normalize />
      <BackgroundsContainer ref={ref} style={{ background: 'white' }} backgrounds={backgrounds}>
        <Grid>
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
      </BackgroundsContainer>
    </>
  )
})

export default Root
