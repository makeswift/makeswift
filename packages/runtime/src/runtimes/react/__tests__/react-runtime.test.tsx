/** @jest-environment jsdom */
import { type MouseEvent } from 'react'
import {
  Checkbox,
  Combobox,
  Color,
  Image,
  Link,
  List,
  Number,
  Select,
  Shape,
  TextArea,
  TextInput,
} from '../../../controls'

import { ReactRuntime } from '../react-runtime'

type Card = {
  imageSrc?: string
  imageAlt: string
  title: string
  text: string
  link: {
    href: string
    onClick: (event: MouseEvent) => void
  }
}

type Entity = {
  id: number
  name: string
}

function Sandbox(props: {
  cards: Card[]
  entityId?: Entity['id']
  theme: 'light' | 'dark'
  background: string
  boolean: boolean
  number?: number
}) {
  return <div>{JSON.stringify(props)}</div>
}

const runtime = new ReactRuntime()

describe('registerComponent', () => {
  test("correctly deduces control definitions' resolved value types", () => {
    runtime.registerComponent(Sandbox, {
      type: 'sandbox',
      label: 'Sandbox',
      props: {
        cards: List({
          label: 'Cards',
          type: Shape({
            type: {
              imageSrc: Image({ label: 'Image' }),
              imageAlt: TextInput({
                label: 'Alt text',
                defaultValue: 'Image',
              }),
              title: TextInput({
                label: 'Title',
                defaultValue: 'This is a title',
              }),
              text: TextArea({
                label: 'Text',
                defaultValue: 'Lorem ipsum',
              }),
              link: Link({ label: 'On click' }),
            },
          }),
          getItemLabel(item) {
            return item?.title ?? 'This is a title'
          },
        }),
        entityId: Combobox({
          async getOptions() {
            return fetch(`/api/entities`)
              .then(r => r.json())
              .then((entities: Entity[]) =>
                entities.map(entity => ({
                  id: entity.id.toString(),
                  label: entity.name,
                  value: entity.id,
                })),
              )
          },
          label: 'Entity',
        }),
        theme: Select({
          label: 'Text color',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ],
          defaultValue: 'light',
        }),
        background: Color({ label: 'Background color', defaultValue: '#fff' }),
        boolean: Checkbox({ label: 'Boolean', defaultValue: true }),
        number: Number({ label: 'Number' }),
      },
    })
  })
})
