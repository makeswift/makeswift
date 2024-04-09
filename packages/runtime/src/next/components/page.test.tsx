import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, test } from 'vitest'
import { MakeswiftPageSnapshot } from '../client'
import { MakeswiftComponentType } from '../../components'
import { ElementData } from '../../state/react-page'
import { randomUUID } from 'crypto'
import {
  BorderDescriptor,
  ResponsiveBorderData,
  Types,
  createBorderPropControllerDataFromResponsiveBorderData,
} from '@makeswift/prop-controllers'
import { Page } from './page'

describe('Page', () => {
  test('can render built-in Box border v0 data', () => {
    // Arrange
    const definition: BorderDescriptor = {
      type: Types.Border,
      options: {},
    }
    const borderData: ResponsiveBorderData = [
      {
        deviceId: 'desktop',
        value: {
          borderTop: {
            width: 1,
            style: 'solid',
          },
          borderRight: null,
          borderBottom: null,
          borderLeft: null,
        },
      },
    ]
    const elementData: ElementData = {
      key: randomUUID(),
      type: MakeswiftComponentType.Box,
      props: {
        id: 'box-test-id',
        border: createBorderPropControllerDataFromResponsiveBorderData(definition, borderData),
      },
    }
    const snapshot = createMakeswiftPageSnapshot([elementData])
    render(<Page snapshot={snapshot} />)

    // Act
    // Assert
    const box = screen.getByTestId('box-test-id')
    console.log(screen.debug())
    expect(box.style.borderTop).toBe('1px solid')
  })

  test('can render built-in Box border v1 data', () => {
    // Arrange
    const definition: BorderDescriptor = {
      type: Types.Border,
      version: 1,
      options: {},
    }
    const borderData: ResponsiveBorderData = [
      {
        deviceId: 'desktop',
        value: {
          borderTop: {
            width: 1,
            style: 'solid',
          },
          borderRight: null,
          borderBottom: null,
          borderLeft: null,
        },
      },
    ]
    const elementData: ElementData = {
      key: randomUUID(),
      type: MakeswiftComponentType.Box,
      props: {
        id: 'box-test-id',
        border: createBorderPropControllerDataFromResponsiveBorderData(definition, borderData),
      },
    }
    const snapshot = createMakeswiftPageSnapshot([elementData])
    render(<Page snapshot={snapshot} />)

    // Act
    // Assert
    expect(screen.getByTestId('box-test-id').style.borderTop).toBe('1px solid')
  })
})

export function createMakeswiftPageSnapshot(
  elements?: ElementData[],
  partialSnapshot: Partial<MakeswiftPageSnapshot> = {},
): MakeswiftPageSnapshot {
  return {
    document: {
      id: 'test-page-id',
      site: { id: 'test-site-id' },
      data: {
        key: randomUUID(),
        type: MakeswiftComponentType.Root,
        props: {
          children: {
            columns: [
              {
                deviceId: 'desktop',
                value: {
                  count: 12,
                  spans: elements?.map(() => [12]),
                },
              },
            ],
            elements,
          },
        },
      },
      snippets: [],
      fonts: [],
      meta: {},
      seo: {},
      localizedPages: [],
      locale: null,
      ...partialSnapshot.document,
    },
    apiOrigin: 'https://test-api-origin.com',
    cacheData: {},
    preview: false,
    localizedResourcesMap: {},
    locale: null,
    ...partialSnapshot,
  }
}
