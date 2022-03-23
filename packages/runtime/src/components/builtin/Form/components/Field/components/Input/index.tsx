import { ComponentPropsWithoutRef, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { cssMediaRules } from '../../../../../../utils/cssMediaRules'
import { Size, useFormContext, Sizes, Value } from '../../../../context/FormContext'
import cssField from '../../services/cssField'

export function getSizeHeight(size: Size): number {
  switch (size) {
    case Sizes.SMALL:
      return 36

    case Sizes.MEDIUM:
      return 42

    case Sizes.LARGE:
      return 48

    default:
      throw new Error(`Invalid form size "${size}"`)
  }
}

const Base = styled.input<
  Pick<Value, 'shape' | 'size' | 'contrast' | 'brandColor'> & { error?: boolean }
>`
  ${cssField()}
  ${props =>
    cssMediaRules(
      [props.size] as const,
      ([size = Sizes.MEDIUM]) => css`
        min-height: ${getSizeHeight(size)}px;
        max-height: ${getSizeHeight(size)}px;
      `,
    )}
`

type BaseProps = { error?: boolean; form?: unknown }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof Base>, keyof BaseProps>

export default forwardRef<HTMLInputElement, Props>(function Input(
  { error = false, form, ...restOfProps }: Props,
  ref,
) {
  const { shape, size, contrast, brandColor } = useFormContext()

  return (
    <Base
      {...restOfProps}
      ref={ref}
      error={error}
      shape={shape}
      // @ts-expect-error: HTMLInputEleent `size` attribute conflicts with prop
      size={size}
      contrast={contrast}
      brandColor={brandColor}
    />
  )
})
