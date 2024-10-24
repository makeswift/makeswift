'use client'

import { cx } from '@emotion/css'
import {
  Children,
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
} from 'react'
import { useStyle } from '../../../runtimes/react/use-style'
import { useBackgrounds } from '../../hooks'
import Backgrounds from './components/Backgrounds'
import { ResponsiveBackgroundsData } from '@makeswift/prop-controllers'

type BaseProps = {
  backgrounds: ResponsiveBackgroundsData | undefined
  children: ReactElement<ElementType>
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export default forwardRef<HTMLDivElement | null, Props>(function BackgroundsContainer(
  { backgrounds, children, className, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const widthAndMarginStyle = useStyle({
    width: '100%',
    margin: '0 auto',
  })

  return (
    <div
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({
          position: 'relative',
          '> *': {
            borderRadius: 'inherit',
            height: 'inherit',
          },
          '> :last-child': {
            position: 'relative',
          },
        }),
        className ? className : widthAndMarginStyle,
      )}
    >
      <Backgrounds backgrounds={useBackgrounds(backgrounds)} />
      {Children.only(children)}
    </div>
  )
})
