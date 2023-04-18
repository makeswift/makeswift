import { forwardRef, CSSProperties, ComponentPropsWithoutRef, ForwardedRef } from 'react'
import Color from 'color'

import { getSizeHeight as getSize } from '../Label'
import {
  useFormContext,
  Value as FormContextValue,
  Sizes,
  Contrasts,
} from '../../../../context/FormContext'
import { getContrastBorderColor, getContrastBackgroundColor } from '../../services/responsiveField'
import { colorToString } from '../../../../../../utils/colorToString'
import { SwatchValue } from '../../../../../../utils/types'
import { useStyle } from '../../../../../../../runtimes/react/use-style'
import { cx } from '@emotion/css'
import { useResponsiveStyle } from '../../../../../../utils/responsive-style'

function getCheckmarkColor({
  swatch: { hue: h, saturation: s, lightness: l },
  alpha: a,
}: {
  swatch: SwatchValue
  alpha: number
}) {
  return Color({ h, s, l }).alpha(a).isLight() ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)'
}

type FakeCheckboxProps = {
  className?: string
  style?: CSSProperties
  contrast?: FormContextValue['contrast']
  error?: boolean
}

const FAKE_CHECKBOX_CLASS_NAME = 'fake-checkbox'

function FakeCheckbox({ className, style, contrast, error }: FakeCheckboxProps) {
  return (
    <div
      style={style}
      className={cx(
        FAKE_CHECKBOX_CLASS_NAME,
        useStyle({
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderStyle: 'solid',
          borderRadius: 4,
          pointerEvents: 'none',
          borderWidth: 1,
        }),
        useStyle(
          useResponsiveStyle([contrast] as const, ([contrast = Contrasts.LIGHT]) => ({
            borderColor: getContrastBorderColor(contrast, error),
            backgroundColor: getContrastBackgroundColor(contrast),
          })),
        ),
        className,
      )}
    />
  )
}

type HiddenCheckboxBaseProps = Partial<
  Pick<FormContextValue, 'size' | 'brandColor' | 'contrast'>
> & {
  error?: boolean
}

type HiddenCheckboxProps = HiddenCheckboxBaseProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof HiddenCheckboxBaseProps>

const HiddenCheckbox = forwardRef(function HiddenCheckbox(
  { size, brandColor, contrast, error, className, ...restOfProps }: HiddenCheckboxProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      {...restOfProps}
      ref={ref}
      className={cx(
        useStyle({
          position: 'absolute',
          opacity: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',

          '&:disabled': {
            cursor: 'no-drop',

            [`& ~ .${FAKE_CHECKBOX_CLASS_NAME}`]: {
              opacity: 0.5,
            },
          },

          [`&:checked ~ .${FAKE_CHECKBOX_CLASS_NAME}`]: {
            ...useResponsiveStyle(
              [brandColor] as const,
              ([{ swatch = { hue: 0, saturation: 0, lightness: 0 }, alpha = 1 } = {}]) => ({
                backgroundColor: colorToString({ swatch, alpha }),
              }),
            ),
            borderColor: 'transparent',

            '&::after': {
              content: '""',
              position: 'absolute',
              boxSizing: 'content-box',
              width: '25%',
              height: '50%',
              borderStyle: 'solid',
              ...useResponsiveStyle(
                [size, brandColor] as const,
                ([
                  size = Sizes.MEDIUM,
                  { swatch = { hue: 0, saturation: 0, lightness: 0 }, alpha = 1 } = {},
                ]) => ({
                  borderWidth: getSize(size) * 0.1,
                  borderLeft: 0,
                  borderTop: 0,
                  borderColor: getCheckmarkColor({ swatch, alpha }),
                }),
              ),
              transform: 'rotate(45deg) translate3d(91%, -23%, 0)',
            },
          },

          '&:not(:disabled)': {
            [`&:focus ~ .${FAKE_CHECKBOX_CLASS_NAME}`]: useResponsiveStyle(
              [brandColor] as const,
              ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => ({
                borderColor: colorToString(brandColor),
              }),
            ),
          },

          '&:not(:disabled):checked': {
            [`&:focus ~ .${FAKE_CHECKBOX_CLASS_NAME}`]: useResponsiveStyle(
              [contrast] as const,
              ([contrast = Contrasts.LIGHT]) => ({
                borderColor: getContrastBorderColor(contrast, error),
              }),
            ),
          },
        }),
        className,
      )}
    />
  )
})

type BaseProps = {
  error?: boolean
  className?: string
  style?: CSSProperties
  form?: unknown
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof HiddenCheckbox>, keyof BaseProps>

export default forwardRef<HTMLInputElement, Props>(function Checkbox(
  { error, className, style, form, ...restOfProps }: Props,
  ref,
) {
  const { size, contrast, brandColor } = useFormContext()

  return (
    <div
      className={cx(
        useStyle({ position: 'relative' }),
        useStyle(
          useResponsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
            height: getSize(size),
            width: getSize(size),
          })),
        ),
      )}
    >
      <HiddenCheckbox
        {...restOfProps}
        type="checkbox"
        ref={ref}
        error={error}
        size={size}
        contrast={contrast}
        brandColor={brandColor}
      />
      <FakeCheckbox className={className} error={error} contrast={contrast} style={style} />
    </div>
  )
})
