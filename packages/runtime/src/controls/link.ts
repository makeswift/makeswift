import { CopyContext, ReplacementContext } from '../state/react-page'

type OpenPageLink = {
  type: 'OPEN_PAGE'
  payload: { pageId: string | null | undefined; openInNewTab: boolean }
}

type OpenURLLink = { type: 'OPEN_URL'; payload: { url: string; openInNewTab: boolean } }

type SendEmailLink = {
  type: 'SEND_EMAIL'
  payload: { to: string; subject?: string; body?: string }
}

type CallPhoneLink = { type: 'CALL_PHONE'; payload: { phoneNumber: string } }

type ScrollToElementLink = {
  type: 'SCROLL_TO_ELEMENT'
  payload: {
    elementIdConfig: { elementKey: string; propName: string } | null | undefined
    block: 'start' | 'center' | 'end'
  }
}

export type LinkControlData =
  | OpenPageLink
  | OpenURLLink
  | SendEmailLink
  | CallPhoneLink
  | ScrollToElementLink

export const LinkControlType = 'makeswift::controls::link'

type LinkControlConfig = {
  label?: string
}

export type LinkControlDefinition<C extends LinkControlConfig = LinkControlConfig> = {
  type: typeof LinkControlType
  config: C
}

export function Link<C extends LinkControlConfig>(config: C = {} as C): LinkControlDefinition<C> {
  return { type: LinkControlType, config }
}

export function copyLinkData(
  value: LinkControlData | undefined,
  context: CopyContext,
): LinkControlData | undefined {
  if (value == null) return value

  if (value.type === 'OPEN_PAGE') {
    const pageId = value.payload.pageId

    if (pageId != null) {
      return {
        ...value,
        payload: {
          ...value.payload,
          pageId: context.replacementContext.pageIds.get(pageId) ?? pageId,
        },
      }
    }
  }

  return value
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('link', () => {
    test('page id is replaced by one in replacement context', () => {
      // Arrange
      const data: LinkControlData = {
        type: 'OPEN_PAGE',
        payload: {
          pageId: 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=',
          openInNewTab: false,
        },
      }
      const expected = JSON.parse(
        JSON.stringify(data).replace(
          'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=',
          'testing',
        ),
      )

      const replacementContext = {
        elementHtmlIds: new Set(),
        elementKeys: new Map(),
        swatchIds: new Map(),
        pageIds: new Map([['UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=', 'testing']]),
        typographyIds: new Map(),
        tableIds: new Map(),
        tableColumnIds: new Map(),
        fileIds: new Map(),
        globalElementIds: new Map(),
        globalElementData: new Map(),
      }

      // Act
      const result = copyLinkData(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
