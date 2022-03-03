import { ComponentPropsWithoutRef, useRef, useState, useLayoutEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'

import CaretDown8 from '../../../../icons/caret-down-8.svg'
import Plus8 from '../../../../icons/plus-8.svg'
import ArrowDown8 from '../../../../icons/arrow-down-8.svg'
import ChevronDown8 from '../../../../icons/chevron-down-8.svg'
import { cssMediaRules } from '../../../utils/cssMediaRules'
import {
  ResponsiveValue,
  ResponsiveColorValue,
  TextStyleValue,
  LinkValue,
} from '../../../../prop-controllers/descriptors'
import { ColorValue as Color } from '../../../utils/types'
import { colorToString } from '../../../utils/colorToString'
import { useColor } from '../../../hooks'

import { Link } from '../../../Link'
import Button from '../../../Button'

const DROP_DOWN_MENU_WIDTH = 200

type Position = 'left' | 'right'

const DropDownMenu = styled.div<{ position: Position }>`
  position: absolute;
  top: 100%;
  left: ${props => (props.position === 'left' ? 0 : 'auto')};
  right: ${props => (props.position === 'right' ? 0 : 'auto')};
  background: #fff;
  margin: 0;
  padding: 8px 0;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  width: ${DROP_DOWN_MENU_WIDTH}px;
  z-index: 99;
  list-style: none;
  overflow: hidden;
  transform-origin: 50% 0;
  will-change: transform, opacity;
  transform-style: preserve-3d;
  display: none;
`

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

const DropDownContainer = styled.div`
  position: relative;

  &:hover > ${DropDownMenu} {
    display: block;
    animation: ${dropIn} 0.25s;
  }
`

const StyledDropDownItem = styled(Link)<{
  color?: ResponsiveValue<Color> | null
  textStyle?: TextStyleValue
}>`
  display: block;
  text-decoration: none;
  line-height: 1.4;
  padding: 8px 16px;
  color: black;
  background-color: transparent;
  transition: background-color 0.2s;
  ${p =>
    cssMediaRules([p.color, p.textStyle] as const, ([color, textStyle = {}]) => {
      const fontSize = textStyle.fontSize || { value: 14, unit: 'px' }
      const fontWeight = textStyle.fontWeight == null ? 'normal' : textStyle.fontWeight
      const fontStyle = textStyle.fontStyle || []
      const letterSpacing = textStyle.letterSpacing == null ? null : textStyle.letterSpacing
      const textTransform = textStyle.textTransform || []

      return css`
        color: ${color == null ? 'black' : colorToString(color)};
        font-size: ${`${fontSize.value}${fontSize.unit}`};
        font-weight: ${fontWeight};
        font-style: ${fontStyle.includes('italic') ? 'italic' : 'normal'};
        letter-spacing: ${letterSpacing == null ? 'normal' : `${letterSpacing}px`};
        text-transform: ${textTransform.includes('uppercase') ? 'uppercase' : 'none'};
      `
    })}

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`

type BaseDropDownItemProps = {
  color?: ResponsiveColorValue
  textStyle?: TextStyleValue
}

type DropDownItemProps = BaseDropDownItemProps &
  Omit<ComponentPropsWithoutRef<typeof StyledDropDownItem>, keyof BaseDropDownItemProps>

function DropDownItem({ color, ...restOfProps }: DropDownItemProps) {
  // @ts-expect-error: HTMLDivElement `color` attribute conflicts with prop.
  return <StyledDropDownItem {...restOfProps} color={useColor(color)} />
}

type Props = ComponentPropsWithoutRef<typeof Button> & {
  label: string
  caret?: 'caret' | 'plus' | 'arrow-down' | 'chevron-down'
  links?: Array<{
    id: string
    payload: ComponentPropsWithoutRef<typeof DropDownItem> & {
      link?: LinkValue
      label: string
    }
  }>
}

export default function DropDownButton({
  label,
  caret = 'caret',
  links = [],
  ...restOfProps
}: Props): JSX.Element {
  const container = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position>('left')

  useLayoutEffect(() => {
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
      <Button {...restOfProps}>
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <span css={{ marginRight: 6 }}>{label}</span>
          <span css={{ display: 'inline-flex', fill: 'currentColor' }}>
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
