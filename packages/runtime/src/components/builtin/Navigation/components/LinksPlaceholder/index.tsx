import { ReactNode } from 'react'
import { ResponsiveLengthData } from '@makeswift/prop-controllers'
import { useStyle } from '../../../../../runtimes/react/use-style'
import GutterContainer from '../../../../shared/GutterContainer'

type PlaceholderLinkProps = {
  width: number
  button?: boolean
}

function PlaceholderLink({ width, button }: PlaceholderLinkProps) {
  return (
    <div
      className={useStyle({
        width,
        height: button === true ? 32 : 8,
        backgroundColor: '#a1a8c2',
        borderRadius: button === true ? 6 : 2,
        opacity: 0.4,
      })}
    />
  )
}

type Props = { gutter?: ResponsiveLengthData }

const links = [{ width: 50 }, { width: 70 }, { width: 60 }, { width: 80, button: true }]

export default function LinksPlaceholder({ gutter }: Props): ReactNode {
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
