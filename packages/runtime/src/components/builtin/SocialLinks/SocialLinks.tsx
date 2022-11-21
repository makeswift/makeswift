import { forwardRef, Ref } from 'react'

import { Link } from '../../shared/Link'
import { SocialLinksOptions } from './options'
import GutterContainer from '../../shared/GutterContainer'
import SocialLinksPlaceholder from './components/SocialLinksPlaceholder'
import {
  ElementIDValue,
  SocialLinksValue,
  ResponsiveIconRadioGroupValue,
  ResponsiveSelectValue,
  GapXValue,
  MarginValue,
  WidthValue,
} from '../../../prop-controllers/descriptors'
import { ResponsiveColor } from '../../../runtimes/react/controls'

type Props = {
  id?: ElementIDValue
  links?: SocialLinksValue
  shape?: ResponsiveIconRadioGroupValue<'naked' | 'circle' | 'rounded' | 'square'>
  size?: ResponsiveIconRadioGroupValue<'small' | 'medium' | 'large'>
  hoverStyle?: ResponsiveSelectValue<'none' | 'grow' | 'shrink' | 'fade'>
  fill?: ResponsiveColor | null
  backgroundColor?: ResponsiveColor | null
  alignment?: ResponsiveIconRadioGroupValue<'flex-start' | 'center' | 'flex-end'>
  gutter?: GapXValue
  width?: WidthValue
  margin?: MarginValue
}

const SocialLinks = forwardRef(function SocialLinks(
  { id, links: { links, openInNewTab } = { links: [], openInNewTab: false }, gutter }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} id={id}>
      {links.length > 0 ? (
        links.map((link, i) => {
          const option = SocialLinksOptions.find(o => o.type === link.payload.type)

          if (!option) throw new Error(`Invalid link payload type ${link.payload.type}`)

          return (
            <GutterContainer
              key={link.id}
              gutter={gutter}
              first={i === 0}
              last={i === links.length - 1}
            >
              <Link link={{ type: 'OPEN_URL', payload: { url: link.payload.url, openInNewTab } }}>
                {option == null ? null : option.icon}
              </Link>
            </GutterContainer>
          )
        })
      ) : (
        <SocialLinksPlaceholder gutter={gutter} />
      )}
    </div>
  )
})

export default SocialLinks
