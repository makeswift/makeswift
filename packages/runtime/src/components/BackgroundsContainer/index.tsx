import {
  ReactElement,
  ElementType,
  forwardRef,
  Children,
  ComponentPropsWithoutRef,
  useImperativeHandle,
  useState,
} from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import Backgrounds from './components/Backgrounds'
import { BackgroundsValue as BackgroundsPropControllerValue } from '../../prop-controllers/descriptors'
import { useBackgrounds } from '../hooks'
import { Ref } from 'react'

const OuterContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  margin: 0 auto;

  > * {
    border-radius: inherit;
    height: inherit;
  }

  > :last-child {
    position: relative;
  }
`

type BaseProps = {
  backgrounds: BackgroundsPropControllerValue | null | undefined
  children: ReactElement<ElementType>
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof OuterContainer>, keyof BaseProps>

export default forwardRef<HTMLDivElement | null, Props>(function BackgroundsContainer(
  { backgrounds, children, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement | null>,
) {
  const [handle, setHandle] = useState<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => handle, [handle])

  return (
    <OuterContainer {...restOfProps} ref={setHandle}>
      <Backgrounds backgrounds={useBackgrounds(backgrounds)} />
      {Children.only(children)}
    </OuterContainer>
  )
})
