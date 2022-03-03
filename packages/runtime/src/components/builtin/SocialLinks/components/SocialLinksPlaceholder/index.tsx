import styled from 'styled-components'

import { ResponsiveValue, Length } from '../../../../../prop-controllers/descriptors'

import GutterContainer from '../../../../shared/GutterContainer'

const PlaceholderLink = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(161, 168, 194, 0.4);
`

const links = [{ id: '1' }, { id: '2' }, { id: '3' }]

type Props = { gutter?: ResponsiveValue<Length> }

export default function SocialLinksPlaceholder({ gutter }: Props): JSX.Element {
  return (
    <>
      {links.map((link, i) => (
        <GutterContainer
          key={link.id}
          gutter={gutter}
          first={i === 0}
          last={i === links.length - 1}
        >
          <PlaceholderLink />
        </GutterContainer>
      ))}
    </>
  )
}
