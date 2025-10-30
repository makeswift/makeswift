import { ComponentPropsWithoutRef, ForwardedRef, forwardRef, useRef, useState, ReactNode } from 'react'

import { CaretDown8 } from '../../../../icons/CaretDown8'
import { Plus8 } from '../../../../icons/Plus8'
import { ArrowDown8 } from '../../../../icons/ArrowDown8'
import { ChevronDown8 } from '../../../../icons/ChevronDown8'
import { colorToString } from '../../../../utils/colorToString'
import { useResponsiveColor } from '../../../../hooks'

import { Link } from '../../../../shared/Link'
import Button from '../../../Button'
import { useIsomorphicLayoutEffect } from '../../../../hooks/useIsomorphicLayoutEffect'
import { cx, keyframes } from '@emotion/css'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { useResponsiveStyle, useResponsiveTextStyle } from '../../../../utils/responsive-style'
import { LinkData, ResponsiveColorData, ResponsiveTextStyleData } from '@makeswift/prop-controllers'

const DROP_DOWN_MENU_WIDTH = 200

type Position = 'left' | 'right'

const DROP_DOWN_MENU_CLASS_NAME = 'drop-down-menu'

type DropDownMenuBaseProps = {
  position: Position
}

type DropDownMenuProps = DropDownMenuBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof DropDownMenuBaseProps>

function DropDownMenu({ className, position, ...restOfProps }: DropDownMenuProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        DROP_DOWN_MENU_CLASS_NAME,
        useStyle({
          position: 'absolute',
          top: '100%',
          left: position === 'left' ? 0 : 'auto',
          right: position === 'right' ? 0 : 'auto',
          background: '#fff',
          margin: 0,
          padding: '8px 0',
          borderRadius: 4,
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
          width: DROP_DOWN_MENU_WIDTH,
          zIndex: 99,
          listStyle: 'none',
          overflow: 'hidden',
          transformOrigin: '50% 0',
          willChange: 'transform, opacity',
          transformStyle: 'preserve-3d',
          display: 'none',
        }),
        className,
      )}
    />
  )
}

const dropIn = keyframes`
  0% {
      opacity: 0;
      transform: rotateX(-20deg);
  }
  100% {
      opacity: 1;
      transform: none;
  }
`

type DropDownContainerProps = ComponentPropsWithoutRef<'div'>

const DropDownContainer = forwardRef(function DropDownContainer(
  { className, ...restOfProps }: DropDownContainerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({
          position: 'relative',
          [`&:hover .${DROP_DOWN_MENU_CLASS_NAME}`]: {
            display: 'block',
            animation: `${dropIn} 0.25s`,
          },
        }),
        className,
      )}
    />
  )
})

type BaseDropDownItemProps = {
  className?: string
  color?: ResponsiveColorData
  textStyle?: ResponsiveTextStyleData
}

type DropDownItemProps = BaseDropDownItemProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseDropDownItemProps>

function DropDownItem({ className, color, textStyle, ...restOfProps }: DropDownItemProps) {
  const colorData = useResponsiveColor(color)

  return (
    <Link
      {...restOfProps}
      className={cx(
        useStyle({
          display: 'block',
          textDecoration: 'none',
          lineHeight: 1.4,
          padding: '8px 16px',
          color: 'black',
          backgroundColor: 'transparent',
          transition: 'background-color 0.2s',
        }),
        useStyle(useResponsiveTextStyle(textStyle)),
        useStyle(
          useResponsiveStyle([colorData, textStyle] as const, ([color, textStyle = {}]) => {
            const fontSize = textStyle.fontSize || { value: 14, unit: 'px' }
            const fontWeight = textStyle.fontWeight == null ? 'normal' : textStyle.fontWeight
            const fontStyle = textStyle.fontStyle || []
            const letterSpacing = textStyle.letterSpacing == null ? null : textStyle.letterSpacing
            const textTransform = textStyle.textTransform || []

            return {
              color: color == null ? 'black' : colorToString(color),
              fontSize: `${fontSize.value}${fontSize.unit}`,
              fontWeight,
              fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
              letterSpacing: letterSpacing == null ? 'normal' : `${letterSpacing}px`,
              textTransform: textTransform.includes('uppercase') ? 'uppercase' : 'none',
            }
          }),
        ),
        useStyle({
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }),
        className,
      )}
    />
  )
}

type Props = Omit<ComponentPropsWithoutRef<typeof Button>, 'textColor' | 'color'> & {
  label: string
  caret?: 'caret' | 'plus' | 'arrow-down' | 'chevron-down'
  links?: Array<{
    id: string
    payload: ComponentPropsWithoutRef<typeof DropDownItem> & {
      link?: LinkData
      label: string
    }
  }>
  textColor?: ResponsiveColorData
  color?: ResponsiveColorData
}

export default function DropDownButton({
  label,
  caret = 'caret',
  links = [],
  textColor,
  color,
  ...restOfProps
}: Props): ReactNode {
  const container = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position>('left')

  useIsomorphicLayoutEffect(() => {
    if (
      container.current &&
      container.current.ownerDocument.defaultView!.innerWidth <
        container.current.offsetLeft + DROP_DOWN_MENU_WIDTH
    ) {
      setPosition('right')
    } else {
      setPosition('left')
    }
  }, [setPosition])

  return (
    <DropDownContainer ref={container}>
      <Button
        {...restOfProps}
        textColor={useResponsiveColor(textColor)}
        color={useResponsiveColor(color)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 6 }}>{label}</span>
          <span style={{ display: 'inline-flex', fill: 'currentColor' }}>
            {caret === 'caret' && <CaretDown8 />}
            {caret === 'plus' && <Plus8 />}
            {caret === 'arrow-down' && <ArrowDown8 />}
            {caret === 'chevron-down' && <ChevronDown8 />}
          </span>
        </div>
      </Button>
      <DropDownMenu position={position}>
        {links.map(({ id, payload }) => (
          <DropDownItem {...payload} key={id}>
            {payload.label}
          </DropDownItem>
        ))}
      </DropDownMenu>
    </DropDownContainer>
  )
}
