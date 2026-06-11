import { ReactNode } from 'react'
import { useFormContext, Sizes, Shapes, Value } from '../../../../context/FormContext'
import { getSizeHeight as getLabelSizeHeight } from '../Label'
import { getSizeHeight as getInputSizeHeight } from '../Input'
import { getShapeBorderRadius } from '../../services/responsiveField'
import { useResponsiveStyle } from '../../../../../../utils/responsive-style'
import { composeStyles, useStyle } from '../../../../../../../runtimes/react/css-runtime/hooks/use-style'

function Label({ size }: Pick<Value, 'size'>) {
  const styles = composeStyles(
    useStyle({
      display: 'block',
      maxWidth: 120,
      minWidth: 60,
      borderRadius: 2,
      backgroundColor: '#5f49f4',
      opacity: 0.4,
    }),
    useStyle(
      useResponsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
        margin: `calc(0.25 * ${getLabelSizeHeight(size)}px + 2px) 0`,
        minHeight: 0.5 * getLabelSizeHeight(size),
        maxHeight: 0.5 * getLabelSizeHeight(size),
      })),
    )
  )
  return (
    <>
      {styles.styleElements}
      <div
        className={styles.className}
      />
    </>
  )
}

function Input({ shape, size }: Pick<Value, 'shape' | 'size'>) {
  const styles = composeStyles(
    useStyle({
      display: 'block',
      width: '100%',
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: '#5f49f4',
      opacity: 0.4,
    }),
    useStyle(
      useResponsiveStyle(
        [shape, size] as const,
        ([shape = Shapes.ROUNDED, size = Sizes.MEDIUM]) => ({
          minHeight: getInputSizeHeight(size),
          maxHeight: getInputSizeHeight(size),
          borderRadius: getShapeBorderRadius(shape),
        }),
      ),
    )
  )
  return (
    <>
      {styles.styleElements}
      <div
        className={styles.className}
      />
    </>
  )
}

export default function PlaceholderTableField(): ReactNode {
  const { size, shape } = useFormContext()

  return (
    <>
      <Label size={size} />
      <Input shape={shape} size={size} />
    </>
  )
}
