import { type ValueType } from '@makeswift/controls'
import { Style, StyleDefinition, TextInput } from '../../../../../controls'
import { MakeswiftComponentType } from '../../../../../components/builtin/constants'
import { ReactRuntime } from '../../../../../runtimes/react/react-runtime'

function Button({ className, title }: { className: string; title: string }) {
  return <button className={className}>{title}</button>
}

export const value: ValueType<StyleDefinition> = {
  width: [{ deviceId: 'desktop', value: { value: 80, unit: '%' } }],
  margin: [
    {
      deviceId: 'desktop',
      value: {
        marginTop: { value: 4, unit: 'px' },
        marginLeft: undefined,
        marginRight: undefined,
        marginBottom: undefined,
      },
    },
  ],
}

export const valueWithFontFamily: ValueType<StyleDefinition> = {
  width: [{ deviceId: 'desktop', value: { value: 100, unit: '%' } }],
  textStyle: [
    {
      deviceId: 'desktop',
      value: {
        fontFamily: 'Arial',
        letterSpacing: null,
        fontSize: null,
        fontWeight: null,
        textTransform: [],
        fontStyle: [],
      },
    },
  ],
}

export const valueWithCSSVariableFontFamily: ValueType<StyleDefinition> = {
  width: [{ deviceId: 'desktop', value: { value: 100, unit: '%' } }],
  textStyle: [
    {
      deviceId: 'desktop',
      value: {
        fontFamily: 'var(--font-heading)',
        letterSpacing: null,
        fontSize: null,
        fontWeight: null,
        textTransform: [],
        fontStyle: [],
      },
    },
  ],
}

export const valueWithInlineBorderColor: ValueType<StyleDefinition> = {
  border: [
    {
      deviceId: 'desktop',
      value: {
        borderTop: {
          width: 2,
          style: 'solid',
          color: { type: 'inline', hue: 238, saturation: 87, lightness: 49, alpha: 0.5 },
        },
        borderRight: null,
        borderBottom: null,
        borderLeft: null,
      },
    },
  ],
}

export const registerComponents = (runtime: ReactRuntime) => {
  runtime.registerComponent(Button, {
    type: MakeswiftComponentType.Button,
    label: 'Button',
    props: {
      className: Style(),
      title: TextInput({ defaultValue: 'Button' }),
    },
  })
}
