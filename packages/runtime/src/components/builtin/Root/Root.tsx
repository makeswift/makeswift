import { normalize } from 'polished'
import { forwardRef, Ref } from 'react'

import Placeholder from './components/Placeholder'
import type { GridValue, BackgroundsValue } from '../../../prop-controllers/descriptors'
import { Element } from '../../../runtimes/react'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import { useGlobalStyle } from '../../../runtimes/react/use-global-style'
import { GridItem } from '../../shared/grid-item'
import { useStyle } from '../../../runtimes/react/use-style'
import { ResponsiveGapData } from '@makeswift/prop-controllers'

type Props = {
  children?: GridValue
  backgrounds?: BackgroundsValue
  rowGap?: ResponsiveGapData
  columnGap?: ResponsiveGapData
}

const Root = forwardRef(function Page(
  { children, backgrounds, rowGap, columnGap }: Props,
  ref: Ref<HTMLDivElement>,
) {
  useGlobalStyle({
    html: {
      boxSizing: 'border-box',
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit',
    },
  })

  useGlobalStyle(normalize())

  return (
    <BackgroundsContainer ref={ref} style={{ background: 'white' }} backgrounds={backgrounds}>
      <div className={useStyle({ display: 'flex', flexWrap: 'wrap', width: '100%' })}>
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
      </div>
    </BackgroundsContainer>
  )
})

export default Root
