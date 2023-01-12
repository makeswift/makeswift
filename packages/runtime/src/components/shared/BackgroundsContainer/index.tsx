import { cx } from '@emotion/css'
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
  backgrounds: BackgroundsPropControllerValue | null | undefined
  children: ReactElement<ElementType>
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export default forwardRef<HTMLDivElement | null, Props>(function BackgroundsContainer(
  { backgrounds, children, className, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement | null>,
) {
  const [handle, setHandle] = useState<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => handle, [handle])

  return (
    <div
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
    </div>
  )
})
