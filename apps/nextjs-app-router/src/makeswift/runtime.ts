import { ReactRuntime } from '@makeswift/runtime/react'
import { Sandbox } from './Sandbox'
import {
  Checkbox,
  Color,
  Combobox,
  Image,
  List,
  Number,
  RichText,
  Select,
  Shape,
  Style,
  TextArea,
  TextInput,
  Link,
  unstable_Typography,
  unstable_IconRadioGroup,
  Slot,
  unstable_StyleV2,
} from '@makeswift/runtime/controls'

const runtime = new ReactRuntime({
  breakpoints: {
    mobile: { width: 575, viewport: 390, label: 'Mobile' },
    tablet: { width: 768, viewport: 765, label: 'Tablet' },
    laptop: { width: 1024, viewport: 1000, label: 'Laptop' },
    external: { width: 1280, label: 'External' },
  },
})

runtime.registerComponent(Sandbox, {
  type: 'sandbox',
  label:
    'Normal Grouping / Super long custom component grouping / Really long component name',
  props: {
    slot: Slot(),
    className: Style({ properties: Style.All }),
    styleV2: unstable_StyleV2({
      type: Number({ defaultValue: 14 }),
      getStyle(value) {
        return {
          fontSize: `${value}px`,
        }
      },
    }),
    styleV3: unstable_StyleV2({
      type: List({
        type: Number({ defaultValue: 14 }),
        getItemLabel(item) {
          return `${item}px`
        },
      }),
      getStyle(value) {
        return Object.fromEntries(
          value?.map((v, i) => [`fontSize${i}`, `${v}px`]) ?? [],
        )
      },
    }),
    link: Link(),
    number: Number({ defaultValue: 0, max: 10 }),
    text: TextInput({ defaultValue: 'Default Here', selectAll: true }),
    textArea: TextArea({ defaultValue: '' }),
    color: Color({ defaultValue: '#000001' }),
    faultySelect: Select({
      options: [{ value: 'red', label: 'Red' }],
      defaultValue: 'red',
      label: 'Select color',
    }),
    checkbox: Checkbox({ label: 'Checkbox', defaultValue: true }),
    imageUrl: Image({
      label: 'Image',
    }),
    shape: Shape({
      type: {
        checkbox: Checkbox({ defaultValue: true, label: 'Shape checkbox' }),
        colorList: List({
          type: Color({ defaultValue: '#000002' }),
          label: 'Shape color list',
          getItemLabel(item) {
            return JSON.stringify(item)
          },
        }),
        // color: Color({ defaultValue: '#000002' }),
        shapeNumber: Number({ defaultValue: 42, label: 'Shape number' }),
        shapeTextInput: TextInput({
          defaultValue: 'Clifford',
          label: 'Shape text input',
        }),
        shapeTextArea: TextArea({
          defaultValue: 'The Big Red Dog',
          label: 'Shape text area',
          rows: 3,
        }),
        shapeSelect: Select({
          options: [
            { value: 'red', label: 'Red' },
            { value: 'green', label: 'Green' },
            { value: 'blue', label: 'Blue' },
          ],
          defaultValue: 'red',
          label: 'Shape select',
        }),
      },
    }),
    numberList: List({
      label: 'Number list',
      type: Number({ defaultValue: 12 }),
      getItemLabel(item) {
        return item?.toString() ?? 'Untitled'
      },
    }),
    list: List({
      type: Shape({
        type: {
          num: Number({ defaultValue: 0 }),
          str: TextInput({ defaultValue: '' }),
          richTextShape: RichText(),
        },
      }),
      getItemLabel(item) {
        return item?.num?.toString() ?? 'Untitled'
      },
    }),
    richText: RichText(),
    testimonials: List({
      label: 'Testimonials',
      getItemLabel(item) {
        return JSON.stringify(item)
      },
      type: Shape({
        type: {
          title: TextInput({ label: 'Title', defaultValue: '' }),
          body: TextArea({ label: 'Body', defaultValue: '' }),
        },
      }),
    }),
    nestedList: Shape({
      type: {
        combo: Combobox({
          label: 'Combo',
          getOptions() {
            return [{ id: 'id', label: 'Label', value: 'foo' }]
          },
        }),
        comboList: List({
          type: Combobox({
            getOptions() {
              return [{ id: 'id', label: 'Label', value: 'foobar' }]
            },
          }),
        }),
        theList: List({
          label: 'List',
          type: Shape({
            type: {
              num: Number({ defaultValue: 0 }),
              str: TextInput({ defaultValue: '' }),
            },
          }),
        }),
      },
    }),
    combobox: Combobox({
      label: 'Bombo',
      getOptions(query) {
        return [
          { id: 'dingle', value: { t: 3 }, label: 'Dingle' },
          { id: 'foo', value: { t: 4 }, label: 'Foo' },
        ].filter((item) =>
          item.label.toLowerCase().includes(query.toLocaleLowerCase()),
        )
      },
    }),
    colorList: List({
      label: 'Color List',
      type: Color({ defaultValue: 'red' }),
      getItemLabel(item) {
        return 'My Custom'
      },
    }),
    typography: unstable_Typography(),

    icon: unstable_IconRadioGroup({
      options: [{ value: 'T', icon: 'TextAlignCenter', label: 'Center' }],
      defaultValue: 'T',
    }),
  },
})

export { runtime }
