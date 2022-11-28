import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
import { Plugin } from 'slate-react'
import { useStyle } from '../../../../../../runtimes/react/use-style'

import { Link } from '../../../../../shared/Link'

function StyledLink({ className, ...restOfProps }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link {...restOfProps} className={cx(className, useStyle({ textDecoration: 'none' }))} />
}

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
