'use client'

import {
  Children,
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
} from 'react'
import { useBackgrounds } from '../../hooks'
import Backgrounds from './components/Backgrounds'
import { ResponsiveBackgroundsData } from '@makeswift/prop-controllers'
import { useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'
import clsx from 'clsx'

type BaseProps = {
  backgrounds: ResponsiveBackgroundsData | undefined
  children: ReactElement<ElementType>
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export default forwardRef<HTMLDivElement | null, Props>(function BackgroundsContainer(
  { backgrounds, children, className, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const { className: widthAndMarginClassName, styleElement: widthAndMarginStyleElement } = useStyle({
    width: '100%',
    margin: '0 auto',
  })
  const { className: baseClassName, styleElement: baseStyleElement } = useStyle({
    position: 'relative',
    '> *': {
      borderRadius: 'inherit',
      height: 'inherit',
    },
    '> :last-child': {
      position: 'relative',
    },
  })

  return (
    <>
      {baseStyleElement}
      {widthAndMarginStyleElement}
      <div
        {...restOfProps}
        ref={ref}
        className={clsx(
          baseClassName,
          className ? className : widthAndMarginClassName,
        )}
      >
        <Backgrounds backgrounds={useBackgrounds(backgrounds)} />
        {Children.only(children)}
      </div>
    </>
  )
})
