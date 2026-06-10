import { forwardRef, ComponentPropsWithoutRef } from 'react'
import { useFormContext } from '../../../../context/FormContext'
import responsiveField from '../../services/responsiveField'
import { composeStyles, useStyle } from '../../../../../../../runtimes/react/css-runtime/hooks/use-style';

type BaseProps = { error?: boolean; form?: unknown }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'textarea'>, keyof BaseProps>

export default forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { error = false, form, ...restOfProps }: Props,
  ref,
) {
  const { shape, size, contrast, brandColor } = useFormContext()
  const styles = composeStyles(
    useStyle({ resize: 'vertical' }),
    useStyle(responsiveField({ error, shape, size, contrast, brandColor })),
  )

  return (
    <>
      {styles.styleElements}
      <textarea
        {...restOfProps}
        ref={ref}
        className={styles.className}
        rows={4}
      />
    </>
  )
})
