import { ComponentPropsWithoutRef, forwardRef, useMemo } from 'react'

import { Editor as SlateEditor } from 'slate-react'

// @ts-expect-error: no types for '@convertkit/slate-lists'
import Lists from '@convertkit/slate-lists'
import styled from 'styled-components'

import DeviceOverridesMarks from './plugins/DeviceOverridesMarks'
import DeviceOverridesBlocks from './plugins/DeviceOverridesBlocks'
import Link from './plugins/Link'
import Inlines from './plugins/Inlines'

export { overrideTypographyStyle } from './components/Mark'

type Props = ComponentPropsWithoutRef<typeof SlateEditor>

export const RichTextEditor = styled(
  forwardRef<SlateEditor, Props>(function RichTextEditor(
    { placeholder = 'Write some text...', ...restOfProps }: Props,
    ref,
  ) {
    const plugins = useMemo(
      () => [Lists(), Link(), Inlines(), DeviceOverridesBlocks(), DeviceOverridesMarks()],
      [],
    )

    return (
      <SlateEditor
        {...restOfProps}
        ref={ref}
        autoFocus={false}
        plugins={plugins}
        placeholder={placeholder}
      />
    )
  }),
)`
  ul,
  ol {
    margin: 0;
  }
`
