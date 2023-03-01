import { forwardRef, CSSProperties, ComponentPropsWithoutRef, ForwardedRef } from 'react'
import Color from 'color'

import { getSizeHeight as getSize } from '../Label'
import { useFormContext, Sizes, Contrasts, Value } from '../../../../context/FormContext'
import { getContrastBorderColor, getContrastBackgroundColor } from '../../services/responsiveField'
import { colorToString } from '../../../../../../utils/colorToString'
import { ColorValue } from '../../../../../../utils/types'
import { cx } from '@emotion/css'
import { responsiveStyle } from '../../../../../../utils/responsive-style'
import { useStyle } from '../../../../../../../runtimes/react/use-style'

function getCheckmarkColor({
  swatch: { hue: h, saturation: s, lightness: l } = { hue: 0, saturation: 0, lightness: 0 },
  alpha: a = 1,
}: ColorValue) {
  return Color({ h, s, l }).alpha(a).isLight() ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.95)'
}

type ContainerBaseProps = Pick<Value, 'size'>

type ContainerProps = ContainerBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ContainerBaseProps>

function Container({ size, className, ...restOfProps }: ContainerProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        useStyle({ position: 'relative' }),
        useStyle(
          responsiveStyle([size] as const, ([size = Sizes.MEDIUM]) => ({
            height: getSize(size),
            width: getSize(size),
          })),
        ),
        className,
      )}
    />
  )
}

const FAKE_RADIO_BUTTON_CLASS_NAME = 'fake-radio-button'

type FakeRadioButtonBaseProps = Pick<Value, 'contrast'> & { error?: boolean }

type FakeRadioButtonProps = FakeRadioButtonBaseProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof FakeRadioButtonBaseProps>

function FakeRadioButton({ className, contrast, error, ...restOfProps }: FakeRadioButtonProps) {
  return (
    <div
      {...restOfProps}
      className={cx(
        FAKE_RADIO_BUTTON_CLASS_NAME,
        useStyle({
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderStyle: 'solid',
          borderRadius: '50%',
          pointerEvents: 'none',
          borderWidth: 1,
        }),
        useStyle(
          responsiveStyle([contrast] as const, ([contrast = Contrasts.LIGHT]) => ({
            borderColor: getContrastBorderColor(contrast, error),
            backgroundColor: getContrastBackgroundColor(contrast),
          })),
        ),
        className,
      )}
    />
  )
}

type HiddenRadioButtonBaseProps = Partial<Pick<Value, 'brandColor' | 'contrast'>> & {
  error?: boolean
}

type HiddenRadioButtonProps = HiddenRadioButtonBaseProps &
  Omit<ComponentPropsWithoutRef<'input'>, keyof HiddenRadioButtonBaseProps>

const HiddenRadioButton = forwardRef(function HiddenRadioButton(
  { className, brandColor, contrast, error, ...restOfProps }: HiddenRadioButtonProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      {...restOfProps}
      type="radio"
      className={cx(
        useStyle({
          position: 'absolute',
          opacity: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',

          '&:disabled': {
            cursor: 'no-drop',

            [`& ~ .${FAKE_RADIO_BUTTON_CLASS_NAME}`]: {
              opacity: 0.5,
            },
          },

          [`&:checked ~ .${FAKE_RADIO_BUTTON_CLASS_NAME}`]: {
            ...responsiveStyle(
              [brandColor] as const,
              ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => ({
                backgroundColor: colorToString(brandColor),
              }),
            ),
            borderColor: 'transparent',

            '&::after': {
              content: '""',
              position: 'absolute',
              boxSizing: 'content-box',
              top: '50%',
              left: '50%',
              width: '50%',
              height: '50%',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              ...responsiveStyle(
                [brandColor] as const,
                ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => ({
                  backgroundColor: getCheckmarkColor(brandColor),
                }),
              ),
            },
          },

          '&:not(:disabled)': {
            [`&:focus ~ .${FAKE_RADIO_BUTTON_CLASS_NAME}`]: responsiveStyle(
              [brandColor] as const,
              ([brandColor = { swatch: { hue: 0, saturation: 0, lightness: 0 }, alpha: 1 }]) => ({
                borderColor: colorToString(brandColor),
              }),
            ),
          },

          '&:not(:disabled):checked': {
            [`&:focus ~ .${FAKE_RADIO_BUTTON_CLASS_NAME}`]: responsiveStyle(
              [contrast] as const,
              ([contrast = Contrasts.LIGHT]) => ({
                borderColor: getContrastBorderColor(contrast, error),
              }),
            ),
          },
        }),
        className,
      )}
      ref={ref}
    />
  )
})

type BaseProps = {
  error?: boolean
  className?: string
  style?: CSSProperties
  form?: unknown
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<typeof HiddenRadioButton>, keyof BaseProps>

export default forwardRef<HTMLInputElement, Props>(function RadioButton(
  { error, className, style, form, ...restOfProps }: Props,
  ref,
) {
  const { size, contrast, brandColor } = useFormContext()

  return (
    <Container size={size}>
      <HiddenRadioButton
        {...restOfProps}
        ref={ref}
        error={error}
        contrast={contrast}
        brandColor={brandColor}
      />
      <FakeRadioButton className={className} error={error} contrast={contrast} style={style} />
    </Container>
  )
})
