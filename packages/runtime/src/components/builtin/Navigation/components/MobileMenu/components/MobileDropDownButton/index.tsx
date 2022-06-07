import { ComponentPropsWithoutRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { cssMediaRules, cssTextStyle } from '../../../../../../utils/cssMediaRules'
import {
  ResponsiveValue,
  ResponsiveColorValue,
  TextStyleValue,
  LinkValue,
} from '../../../../../../../prop-controllers/descriptors'
import { ColorValue as Color } from '../../../../../../utils/types'
import { colorToString } from '../../../../../../utils/colorToString'
import { useResponsiveColor } from '../../../../../../hooks'

import { ReactComponent as CaretDown8 } from '../../../../../../icons/caret-down-8.svg'
import { ReactComponent as Plus8 } from '../../../../../../icons/plus-8.svg'
import { ReactComponent as ArrowDown8 } from '../../../../../../icons/arrow-down-8.svg'
import { ReactComponent as ChevronDown8 } from '../../../../../../icons/chevron-down-8.svg'

import { Link } from '../../../../../../shared/Link'
import Button from '../../../../../Button'

const DropDownMenu = styled.div.withConfig({
  shouldForwardProp: prop => !['open'].includes(prop.toString()),
})<{ open: boolean }>`
  display: ${props => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  padding: 8px;
`

const ButtonLink = styled(Button)`
  margin: 8px 0;
`

const StyledLink = styled(Link).withConfig({
  shouldForwardProp: prop => !['textStyle', 'color'].includes(prop.toString()),
})<{
  textStyle?: TextStyleValue
  color?: ResponsiveValue<Color> | null
}>`
  text-decoration: none;
  line-height: 1.4;
  padding: 8px 16px;
  color: black;
  ${cssTextStyle()}
  ${p =>
    cssMediaRules(
      [p.color] as const,
      ([color]) => css`
        color: ${color == null ? 'black' : colorToString(color)};
      `,
    )}
`

type BaseDropDownItemProps = {
  color?: ResponsiveColorValue
  textStyle?: TextStyleValue
}

type DropDownItemProps = BaseDropDownItemProps &
  Omit<ComponentPropsWithoutRef<typeof StyledLink>, keyof BaseDropDownItemProps>

function DropDownItem({ color, ...restOfProps }: DropDownItemProps) {
  // @ts-expect-error: HTMLAnchorElement `color` attribute conflict with props
  return <StyledLink {...restOfProps} color={useResponsiveColor(color)} />
}

type Props = ComponentPropsWithoutRef<typeof Button> & {
  label: string
  links?: Array<{
    id: string
    payload: ComponentPropsWithoutRef<typeof DropDownItem> & {
      link?: LinkValue
      label: string
    }
  }>
  onClose?: () => unknown
  caret?: string
}

export default function MobileDropDownButton({
  label,
  caret,
  links = [],
  onClose = () => {},
  color,
  textColor,
  ...restOfProps
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <ButtonLink
        {...restOfProps}
        textColor={useResponsiveColor(textColor)}
        color={useResponsiveColor(color)}
        onPointerDown={() => setIsOpen(prev => !prev)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 6 }}>{label}</span>
          <span style={{ display: 'inline-flex', fill: 'currentColor' }}>
            <>
              {caret === 'caret' && <CaretDown8 />}
              {caret === 'plus' && <Plus8 />}
              {caret === 'arrow-down' && <ArrowDown8 />}
              {caret === 'chevron-down' && <ChevronDown8 />}
            </>
          </span>
        </div>
      </ButtonLink>
      <DropDownMenu open={isOpen}>
        {links.map(({ id, payload }) => (
          <DropDownItem {...payload} key={id} onClick={onClose}>
            {payload.label}
          </DropDownItem>
        ))}
      </DropDownMenu>
    </>
  )
}
