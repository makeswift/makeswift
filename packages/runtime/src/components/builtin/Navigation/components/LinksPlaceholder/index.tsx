import styled from 'styled-components'

import { ResponsiveLengthValue } from '../../../../../prop-controllers/descriptors'
import GutterContainer from '../../../../shared/GutterContainer'

const PlaceholderLink = styled.div.withConfig({
  shouldForwardProp: prop => !['width', 'button'].includes(prop.toString()),
})<{ width: number; button?: boolean }>`
  width: ${props => props.width}px;
  height: ${props => (props.button === true ? 32 : 8)}px;
  background-color: #a1a8c2;
  border-radius: ${props => (props.button === true ? 6 : 2)}px;
  opacity: 0.4;
`

type Props = { gutter?: ResponsiveLengthValue }

const links = [{ width: 50 }, { width: 70 }, { width: 60 }, { width: 80, button: true }]

export default function LinksPlaceholder({ gutter }: Props): JSX.Element {
  return (
    <>
      {links.map((link, i) => (
        <GutterContainer key={i} gutter={gutter} first={i === 0} last={i === links.length - 1}>
          <PlaceholderLink {...link} />
        </GutterContainer>
      ))}
    </>
  )
}
