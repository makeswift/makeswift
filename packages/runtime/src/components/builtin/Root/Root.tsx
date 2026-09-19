import { normalize } from 'polished'
import { forwardRef, type Ref } from 'react'

import {
  type GridData,
  type ResponsiveBackgroundsData,
  type ResponsiveGapData,
} from '@makeswift/prop-controllers'

import { Element } from '../../../runtimes/react/components/Element'

import { GridItem } from '../../shared/grid-item'
import BackgroundsContainer from '../../shared/BackgroundsContainer'

import Placeholder from './components/Placeholder'
import { useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'
import { CSSObject } from '@emotion/serialize'
import { useCssReset } from '../../../runtimes/react/css-runtime/hooks/use-css-reset'

type Props = {
  children?: GridData
  backgrounds?: ResponsiveBackgroundsData
  rowGap?: ResponsiveGapData
  columnGap?: ResponsiveGapData
}

const cssResetStyles: Array<CSSObject> = [
  {
    html: {
      boxSizing: 'border-box',
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit',
    },
  },
  ...normalize(),
]

const Root = forwardRef(function Page(
  { children, backgrounds, rowGap, columnGap }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const { styleElement: cssResetStyleElement } = useCssReset({ styles: cssResetStyles })
  const { className, styleElement } = useStyle({ display: 'flex', flexWrap: 'wrap', width: '100%' })

  // Stretch the page (and thus its backgrounds) to cover at least the entire viewport,
  // so that shorter pages don't leave negative space below their background.
  const { className: containerClassName, styleElement: containerStyleElement } = useStyle({
    width: '100%',
    margin: '0 auto',
    minHeight: '100vh',
    '@supports (min-height: 100dvh)': {
      minHeight: '100dvh',
    },
  })

  return (
    <>
      {cssResetStyleElement}
      {styleElement}
      {containerStyleElement}
      <BackgroundsContainer
        ref={ref}
        className={containerClassName}
        style={{ background: 'white' }}
        backgrounds={backgrounds}
      >
        <div className={className}>
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
    </>
  )
})

export default Root
