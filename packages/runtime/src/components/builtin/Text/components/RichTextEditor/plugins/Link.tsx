import { cx } from '@emotion/css'
import { ComponentPropsWithoutRef } from 'react'
// import { Plugin } from '../../../../../../old-slate-react-types'
import { useStyle } from '../../../../../../runtimes/react/use-style'

import { Link } from '../../../../../shared/Link'

function StyledLink({ className, ...restOfProps }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link {...restOfProps} className={cx(useStyle({ textDecoration: 'none' }), className)} />
}

export default function LinkPlugin(): any /* Plugin  */ {
  return {
    renderInline(
      props: { attributes: any; children: any; node: any },
      _editor: any,
      next: () => any,
    ) {
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
