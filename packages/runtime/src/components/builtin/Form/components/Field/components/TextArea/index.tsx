import { cx } from '@emotion/css'
import { forwardRef, ComponentPropsWithoutRef } from 'react'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import { useFormContext } from '../../../../context/FormContext'
import responsiveField from '../../services/responsiveField'

type BaseProps = { error?: boolean; form?: unknown }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'textarea'>, keyof BaseProps>

export default forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { error = false, form, ...restOfProps }: Props,
  ref,
) {
  const { shape, size, contrast, brandColor } = useFormContext()

  return (
    <textarea
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({ resize: 'vertical' }),
        useStyle(responsiveField({ error, shape, size, contrast, brandColor })),
      )}
      rows={4}
    />
  )
})
