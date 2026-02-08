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
