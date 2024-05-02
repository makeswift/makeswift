import { normalize } from 'polished'
import { forwardRef, Ref } from 'react'

import type { BackgroundsValue } from '../../../prop-controllers/descriptors'
import BackgroundsContainer from '../../shared/BackgroundsContainer'
import { useGlobalStyle } from '../../../runtimes/react/use-global-style'
import { useStyle } from '../../../runtimes/react/use-style'
import { ResponsiveGapData } from '@makeswift/prop-controllers'
import { SlotControlValue } from '../../../runtimes/react/controls/slot'

type Props = {
  children?: SlotControlValue
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
        {children}
      </div>
    </BackgroundsContainer>
  )
})

export default Root
