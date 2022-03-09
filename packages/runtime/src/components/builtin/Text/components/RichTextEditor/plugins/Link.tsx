import { Plugin } from 'slate-react'
import styled from 'styled-components'

import { Link } from '../../../../../shared/Link'

const StyledLink = styled(Link)`
  text-decoration: none;
`

export default function LinkPlugin(): Plugin {
  return {
    renderInline(props, _editor, next) {
      const { attributes, children, node } = props

      switch (node.type) {
        case 'link': {
          const { data } = node

          return (
            <StyledLink {...attributes} link={data.toJS()}>
              {children}
            </StyledLink>
          )
        }

        default: {
          return next()
        }
      }
    },
  }
}
