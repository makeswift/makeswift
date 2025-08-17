import { normalize } from 'polished'
import { forwardRef, type Ref } from 'react'

import {
  type GridData,
  type ResponsiveBackgroundsData,
  type ResponsiveGapData,
} from '@makeswift/prop-controllers'

import { Element } from '../../../runtimes/react'
import { useGlobalStyle } from '../../../runtimes/react/use-global-style'
import { useStyle } from '../../../runtimes/react/use-style'
import { useCSSResetEnabled } from '../../../runtimes/react/root-style-registry'

import { GridItem } from '../../shared/grid-item'
import BackgroundsContainer from '../../shared/BackgroundsContainer'

import Placeholder from './components/Placeholder'

type Props = {
  children?: GridData
  backgrounds?: ResponsiveBackgroundsData
  rowGap?: ResponsiveGapData
  columnGap?: ResponsiveGapData
}

const Root = forwardRef(function Page(
  { children, backgrounds, rowGap, columnGap }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const cssResetEnabled = useCSSResetEnabled()

  useGlobalStyle(
    cssResetEnabled
      ? [
          { html: { boxSizing: 'border-box' }, '*, *::before, *::after': { boxSizing: 'inherit' } },
          normalize(),
        ]
      : [],
  )

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
