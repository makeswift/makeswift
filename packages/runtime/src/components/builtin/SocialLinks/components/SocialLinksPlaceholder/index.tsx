import { ReactNode } from 'react'
import { LengthData, ResponsiveValue } from '@makeswift/prop-controllers'
import { useStyle } from '../../../../../runtimes/react/use-style'

import GutterContainer from '../../../../shared/GutterContainer'

const links = [{ id: '1' }, { id: '2' }, { id: '3' }]

type Props = { gutter?: ResponsiveValue<LengthData> }

export default function SocialLinksPlaceholder({ gutter }: Props): ReactNode {
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

function PlaceholderLink() {
  return (
    <div
      className={useStyle({
        width: 44,
        height: 44,
        borderRadius: '50%',
        backgroundColor: 'rgba(161, 168, 194, 0.4)',
      })}
    />
  )
}
