import { expectTypeOf } from 'expect-type'
import { NativeLink as Link } from './native-mouse-event-link'
import { DataType, ResolvedValueType, ValueType } from '../control-definition'

type ExpectedLinkControlData =
  | {
      type: 'OPEN_PAGE'
      payload: {
        pageId: string | null | undefined
        openInNewTab: boolean
      }
    }
  | {
      type: 'OPEN_URL'
      payload: {
        url: string
        openInNewTab: boolean
      }
    }
  | {
      type: 'SEND_EMAIL'
      payload: {
        to: string
        subject?: string
        body?: string
      }
    }
  | {
      type: 'CALL_PHONE'
      payload: {
        phoneNumber: string
      }
    }
  | {
      type: 'SCROLL_TO_ELEMENT'
      payload: {
        elementIdConfig:
          | {
              elementKey: string
              propName: string
            }
          | null
          | undefined
        block: 'start' | 'center' | 'end'
      }
    }
  | null

describe('Link Types', () => {
  describe('infers types from control definitions', () => {
    test('empty config', () => {
      const def = Link()

      type Config = typeof def.config
      expectTypeOf<Config>().toEqualTypeOf<{
        label?: string
      }>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<ExpectedLinkControlData>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<ExpectedLinkControlData>

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{
        href: string
        target: '_blank' | '_self' | undefined
        onClick: (args: MouseEvent) => void
      }>
    })
  })
})
