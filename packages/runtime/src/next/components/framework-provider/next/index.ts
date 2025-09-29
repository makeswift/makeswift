import NextImage from 'next/image'
import { Link } from './link'

import {
  DefaultElementData,
  type FrameworkContext,
} from '../../../../runtimes/react/components/framework-context'

export const context: Pick<FrameworkContext, 'Image' | 'Link' | 'ElementData'> = {
  Image: NextImage,
  Link,
  ElementData: DefaultElementData,
}
