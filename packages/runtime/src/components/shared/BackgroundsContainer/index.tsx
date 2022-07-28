import { cx } from '@emotion/css'
import { motion } from 'framer-motion'
import {
  Children,
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
  useImperativeHandle,
  useState,
} from 'react'
import { BackgroundsValue as BackgroundsPropControllerValue } from '../../../prop-controllers/descriptors'
import { useStyle } from '../../../runtimes/react/use-style'
import { useBackgrounds } from '../../hooks'
import Backgrounds from './components/Backgrounds'

type BaseProps = {
  hasAnimations?: boolean
  backgrounds: BackgroundsPropControllerValue | null | undefined
  children: ReactElement<ElementType>
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof motion.div>, keyof BaseProps>

export default forwardRef<HTMLDivElement | null, Props>(function BackgroundsContainer(
  { hasAnimations = false, backgrounds, children, className, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement | null>,
) {
  const [handle, setHandle] = useState<HTMLDivElement | null>(null)
  const Component = hasAnimations ? motion.div : 'div'

  useImperativeHandle(ref, () => handle, [handle])

  return (
    // @ts-ignore: props for `div` and `motion.div` don't match.
    <Component
      {...restOfProps}
      ref={setHandle}
      className={cx(
        useStyle({
          position: 'relative',
          width: '100%',
          margin: '0 auto',
          '> *': {
            borderRadius: 'inherit',
            height: 'inherit',
          },
          '> :last-child': {
            position: 'relative',
          },
        }),
        className,
      )}
    >
      <Backgrounds backgrounds={useBackgrounds(backgrounds)} />
      {Children.only(children)}
    </Component>
  )
})
