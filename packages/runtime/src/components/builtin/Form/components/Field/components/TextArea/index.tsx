import { forwardRef, ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'

import cssField from '../../services/cssField'
import { Value, useFormContext } from '../../../../context/FormContext'

const Base = styled.textarea.withConfig({
  shouldForwardProp: (prop, defaultValidator) =>
    !['error', 'shape', 'size', 'contrast', 'brandColor'].includes(prop.toString()) &&
    defaultValidator(prop),
})<Value & { error?: boolean }>`
  resize: vertical;
  ${cssField()}
`

type BaseProps = { error?: boolean; form?: unknown }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof Base>, keyof BaseProps>

export default forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { error = false, form, ...restOfProps }: Props,
  ref,
) {
  const { shape, size, contrast, brandColor } = useFormContext()

  return (
    <Base
      {...restOfProps}
      ref={ref}
      rows={4}
      error={error}
      shape={shape}
      size={size}
      contrast={contrast}
      brandColor={brandColor}
    />
  )
})
