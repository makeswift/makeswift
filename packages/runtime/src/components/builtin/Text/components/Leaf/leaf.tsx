import { RenderLeafProps } from 'slate-react'
import useEnhancedTypography, {
  useTypographyClassName,
} from '../../../../../runtimes/react/controls/typography'

export function Leaf({ leaf, ...props }: RenderLeafProps) {
  // for each breakpoint fetch related resources and merge its value with its override
  const enhancedTypography = useEnhancedTypography(leaf.typography)

  // for each breakpoint shallow merge back up through the breakpoints and create a className
  const typographyClassName = useTypographyClassName(enhancedTypography)

  return (
    <span {...props.attributes} className={typographyClassName}>
      {props.children}
    </span>
  )
}
