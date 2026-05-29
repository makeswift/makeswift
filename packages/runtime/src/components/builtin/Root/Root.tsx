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
      boxSizing: 'border-box'
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit'
    }
  },
  ...normalize(),
]

const Root = forwardRef(function Page(
  { children, backgrounds, rowGap, columnGap }: Props,
  ref: Ref<HTMLDivElement>,
) {
  // TODO should I update the `composeStyles` util from the css runtime so that I can use it here?
  const { styleElement: cssResetStyleElement } = useCssReset({ styles: cssResetStyles })
  const { className, styleElement } = useStyle({ display: 'flex', flexWrap: 'wrap', width: '100%' })

  return (
    <>
      {cssResetStyleElement}
      {styleElement}
      <BackgroundsContainer ref={ref} style={{ background: 'white' }} backgrounds={backgrounds}>
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
