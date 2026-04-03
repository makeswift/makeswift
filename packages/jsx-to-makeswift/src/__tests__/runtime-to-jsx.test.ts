import {
  transformRuntimeToJSX,
  isMakeswiftRuntimeSchema,
} from '../makeswift-runtime/runtime-to-jsx'
import type { MakeswiftRuntimeSchema } from '../makeswift-runtime/types'

describe('isMakeswiftRuntimeSchema', () => {
  it('returns true for valid runtime schema', () => {
    const schema = {
      key: 'abc123',
      type: './components/Box/index.js',
      props: {},
    }
    expect(isMakeswiftRuntimeSchema(schema)).toBe(true)
  })

  it('returns false for ElementSchema format', () => {
    const schema = {
      type: 'Container',
      tagName: 'div',
      controls: {},
    }
    expect(isMakeswiftRuntimeSchema(schema)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isMakeswiftRuntimeSchema(null)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isMakeswiftRuntimeSchema('string')).toBe(false)
    expect(isMakeswiftRuntimeSchema(123)).toBe(false)
  })
})

describe('transformRuntimeToJSX', () => {
  describe('basic elements', () => {
    it('transforms a simple box', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Box/index.js',
        props: {
          padding: [
            {
              deviceId: 'desktop',
              value: {
                paddingTop: { value: 20, unit: 'px' },
                paddingRight: { value: 20, unit: 'px' },
                paddingBottom: { value: 20, unit: 'px' },
                paddingLeft: { value: 20, unit: 'px' },
              },
            },
          ],
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('<div')
      expect(result.jsx).toContain('lg:p-5')
    })

    it('transforms text with rich-text-v2', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Text/index.js',
        props: {
          text: {
            type: 'makeswift::controls::rich-text-v2',
            version: 2,
            descendants: [
              {
                type: 'default',
                children: [
                  {
                    text: 'Hello World',
                    typography: {
                      style: [
                        {
                          deviceId: 'desktop',
                          value: {
                            fontWeight: 700,
                            fontSize: { value: 24, unit: 'px' },
                          },
                        },
                      ],
                    },
                  },
                ],
                textAlign: [{ deviceId: 'desktop', value: 'center' }],
              },
            ],
            key: 'text-key',
          },
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('<p')
      expect(result.jsx).toContain('Hello World')
      expect(result.jsx).toContain('lg:text-center')
      expect(result.jsx).toContain('lg:text-2xl')
      expect(result.jsx).toContain('lg:font-bold')
    })

    it('transforms image element', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Image/index.js',
        props: {
          image: 'https://example.com/image.jpg',
          alt: 'Example image',
          width: [
            {
              deviceId: 'desktop',
              value: { value: 300, unit: 'px' },
            },
          ],
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('<img')
      expect(result.jsx).toContain('src="https://example.com/image.jpg"')
      expect(result.jsx).toContain('alt="Example image"')
      expect(result.jsx).toContain('lg:w-[300px]')
    })

    it('transforms button with link', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Button/index.js',
        props: {
          link: {
            type: 'OPEN_URL',
            payload: {
              url: '/about',
              openInNewTab: true,
            },
          },
          children: 'Click Me',
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('<button')
      expect(result.jsx).toContain('href="/about"')
      expect(result.jsx).toContain('target="_blank"')
      expect(result.jsx).toContain('Click Me')
    })
  })

  describe('spacing classes', () => {
    it('uses shorthand padding when all sides are equal', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Box/index.js',
        props: {
          padding: [
            {
              deviceId: 'desktop',
              value: {
                paddingTop: { value: 16, unit: 'px' },
                paddingRight: { value: 16, unit: 'px' },
                paddingBottom: { value: 16, unit: 'px' },
                paddingLeft: { value: 16, unit: 'px' },
              },
            },
          ],
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('lg:p-4')
    })

    it('handles margin auto for centering', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Box/index.js',
        props: {
          margin: [
            {
              deviceId: 'desktop',
              value: {
                marginLeft: 'auto',
                marginRight: 'auto',
              },
            },
          ],
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('lg:mx-auto')
    })

    it('handles row and column gaps', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'abc',
        type: './components/Box/index.js',
        props: {
          rowGap: [{ deviceId: 'desktop', value: { value: 24, unit: 'px' } }],
          columnGap: [{ deviceId: 'desktop', value: { value: 16, unit: 'px' } }],
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('lg:gap-y-6')
      expect(result.jsx).toContain('lg:gap-x-4')
    })
  })

  describe('nested elements', () => {
    it('transforms nested children', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'parent',
        type: './components/Box/index.js',
        props: {
          padding: [
            {
              deviceId: 'desktop',
              value: {
                paddingTop: { value: 20, unit: 'px' },
                paddingRight: { value: 20, unit: 'px' },
                paddingBottom: { value: 20, unit: 'px' },
                paddingLeft: { value: 20, unit: 'px' },
              },
            },
          ],
          children: {
            elements: [
              {
                key: 'child1',
                type: './components/Text/index.js',
                props: {
                  text: {
                    type: 'makeswift::controls::rich-text-v2',
                    version: 2,
                    descendants: [
                      {
                        type: 'default',
                        children: [{ text: 'Child Text' }],
                      },
                    ],
                    key: 'text-key',
                  },
                },
              },
            ],
          },
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('<div')
      expect(result.jsx).toContain('<p')
      expect(result.jsx).toContain('Child Text')
      expect(result.jsx).toContain('</div>')
    })
  })

  describe('grid layout', () => {
    it('handles grid columns', () => {
      const schema: MakeswiftRuntimeSchema = {
        key: 'grid',
        type: './components/Box/index.js',
        props: {
          children: {
            elements: [
              {
                key: 'col1',
                type: './components/Box/index.js',
                props: {},
              },
              {
                key: 'col2',
                type: './components/Box/index.js',
                props: {},
              },
              {
                key: 'col3',
                type: './components/Box/index.js',
                props: {},
              },
            ],
            columns: [
              {
                deviceId: 'desktop',
                value: {
                  spans: [[4, 4, 4]],
                  count: 12,
                },
              },
            ],
          },
        },
      }

      const result = transformRuntimeToJSX(schema)
      expect(result.jsx).toContain('lg:grid')
      expect(result.jsx).toContain('lg:grid-cols-12')
      expect(result.jsx).toContain('lg:col-span-4')
    })
  })

  describe('JSON string input', () => {
    it('parses JSON string input', () => {
      const jsonInput = JSON.stringify({
        key: 'abc',
        type: './components/Box/index.js',
        props: {
          padding: [
            {
              deviceId: 'desktop',
              value: {
                paddingTop: { value: 16, unit: 'px' },
                paddingRight: { value: 16, unit: 'px' },
                paddingBottom: { value: 16, unit: 'px' },
                paddingLeft: { value: 16, unit: 'px' },
              },
            },
          ],
        },
      })

      const result = transformRuntimeToJSX(jsonInput)
      expect(result.jsx).toContain('lg:p-4')
    })

    it('returns warning for invalid JSON', () => {
      const result = transformRuntimeToJSX('invalid json')
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })
})
