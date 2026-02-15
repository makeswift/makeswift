import { transformSchemaToJSX, schemaToJSXString } from '../reverse/schema-to-jsx'
import {
  mapStyleToClasses,
  mapColorToClass,
  mapTypographyToClasses,
  addResponsivePrefix,
} from '../reverse/reverse-mapper'
import type { ElementSchema } from '../types'

describe('reverse-mapper', () => {
  describe('mapStyleToClasses', () => {
    it('maps margin values to Tailwind classes', () => {
      const result = mapStyleToClasses({ margin: '1rem' })
      expect(result.classes).toContain('m-4')
    })

    it('maps padding values to Tailwind classes', () => {
      const result = mapStyleToClasses({ padding: '1.5rem' })
      expect(result.classes).toContain('p-6')
    })

    it('maps directional margin values', () => {
      const result = mapStyleToClasses({
        marginTop: '0.5rem',
        marginBottom: '1rem',
      })
      expect(result.classes).toContain('mt-2')
      expect(result.classes).toContain('mb-4')
    })

    it('maps width values', () => {
      const result = mapStyleToClasses({ width: '100%' })
      expect(result.classes).toContain('w-full')
    })

    it('maps height values', () => {
      const result = mapStyleToClasses({ height: '100vh' })
      expect(result.classes).toContain('h-screen')
    })

    it('maps gap values', () => {
      const result = mapStyleToClasses({ gap: '2rem' })
      expect(result.classes).toContain('gap-8')
    })

    it('maps border radius values', () => {
      const result = mapStyleToClasses({ borderRadius: '0.5rem' })
      expect(result.classes).toContain('rounded-lg')
    })

    it('maps display values', () => {
      const result = mapStyleToClasses({ display: 'flex' })
      expect(result.classes).toContain('flex')
    })

    it('maps flex direction values', () => {
      const result = mapStyleToClasses({ flexDirection: 'column' })
      expect(result.classes).toContain('flex-col')
    })

    it('maps justify content values', () => {
      const result = mapStyleToClasses({ justifyContent: 'space-between' })
      expect(result.classes).toContain('justify-between')
    })

    it('maps align items values', () => {
      const result = mapStyleToClasses({ alignItems: 'center' })
      expect(result.classes).toContain('items-center')
    })

    it('maps position values', () => {
      const result = mapStyleToClasses({ position: 'absolute' })
      expect(result.classes).toContain('absolute')
    })

    it('creates arbitrary classes for unmapped values', () => {
      const result = mapStyleToClasses({ margin: '17px' })
      expect(result.classes).toContain('m-[17px]')
    })
  })

  describe('mapColorToClass', () => {
    it('maps text color hex to Tailwind class', () => {
      const result = mapColorToClass('#3b82f6', 'textColor')
      expect(result).toBe('text-blue-500')
    })

    it('maps background color hex to Tailwind class', () => {
      const result = mapColorToClass('#f3f4f6', 'backgroundColor')
      expect(result).toBe('bg-gray-100')
    })

    it('maps border color hex to Tailwind class', () => {
      const result = mapColorToClass('#ef4444', 'borderColor')
      expect(result).toBe('border-red-500')
    })

    it('creates arbitrary class for unknown colors', () => {
      const result = mapColorToClass('#abcdef', 'textColor')
      expect(result).toBe('text-[#abcdef]')
    })
  })

  describe('mapTypographyToClasses', () => {
    it('maps font size to Tailwind class', () => {
      const result = mapTypographyToClasses({ fontSize: '1.5rem' })
      expect(result.classes).toContain('text-2xl')
    })

    it('maps font weight to Tailwind class', () => {
      const result = mapTypographyToClasses({ fontWeight: 700 })
      expect(result.classes).toContain('font-bold')
    })

    it('maps line height to Tailwind class', () => {
      const result = mapTypographyToClasses({ lineHeight: '1.625' })
      expect(result.classes).toContain('leading-relaxed')
    })

    it('maps text align to Tailwind class', () => {
      const result = mapTypographyToClasses({ textAlign: 'center' })
      expect(result.classes).toContain('text-center')
    })

    it('maps font style italic', () => {
      const result = mapTypographyToClasses({ fontStyle: 'italic' })
      expect(result.classes).toContain('italic')
    })

    it('maps text decoration underline', () => {
      const result = mapTypographyToClasses({ textDecoration: 'underline' })
      expect(result.classes).toContain('underline')
    })

    it('maps text transform uppercase', () => {
      const result = mapTypographyToClasses({ textTransform: 'uppercase' })
      expect(result.classes).toContain('uppercase')
    })
  })

  describe('addResponsivePrefix', () => {
    it('adds no prefix for mobile', () => {
      expect(addResponsivePrefix('p-4', 'mobile')).toBe('p-4')
    })

    it('adds sm: prefix for tablet', () => {
      expect(addResponsivePrefix('p-4', 'tablet')).toBe('sm:p-4')
    })

    it('adds lg: prefix for desktop', () => {
      expect(addResponsivePrefix('p-4', 'desktop')).toBe('lg:p-4')
    })
  })
})

describe('schema-to-jsx', () => {
  describe('transformSchemaToJSX', () => {
    it('transforms a simple container', () => {
      const schema: ElementSchema = {
        type: 'Container',
        tagName: 'div',
        controls: {
          style: {
            type: 'Style',
            properties: ['padding'],
            value: [{ deviceId: 'mobile', value: { padding: '1rem' } }],
          },
          content: { type: 'TextInput', value: 'Hello' },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toBe('<div className="p-4">Hello</div>')
    })

    it('transforms with multiple style properties', () => {
      const schema: ElementSchema = {
        type: 'Container',
        tagName: 'div',
        controls: {
          style: {
            type: 'Style',
            properties: ['margin', 'padding'],
            value: [
              { deviceId: 'mobile', value: { margin: '1rem', padding: '1.5rem' } },
            ],
          },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('m-4')
      expect(result.jsx).toContain('p-6')
    })

    it('transforms with color controls', () => {
      const schema: ElementSchema = {
        type: 'Container',
        tagName: 'div',
        controls: {
          backgroundColor: {
            type: 'Color',
            property: 'backgroundColor',
            value: [{ deviceId: 'mobile', value: { color: '#3b82f6', alpha: 1 } }],
          },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('bg-blue-500')
    })

    it('transforms with typography controls', () => {
      const schema: ElementSchema = {
        type: 'Heading',
        tagName: 'h1',
        controls: {
          typography: {
            type: 'Typography',
            value: [
              { deviceId: 'mobile', value: { fontSize: '2.25rem', fontWeight: 700 } },
            ],
          },
          content: { type: 'TextInput', value: 'Title' },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('text-4xl')
      expect(result.jsx).toContain('font-bold')
      expect(result.jsx).toContain('Title')
    })

    it('transforms with responsive values', () => {
      const schema: ElementSchema = {
        type: 'Container',
        tagName: 'div',
        controls: {
          style: {
            type: 'Style',
            properties: ['padding'],
            value: [
              { deviceId: 'mobile', value: { padding: '1rem' } },
              { deviceId: 'tablet', value: { padding: '1.5rem' } },
              { deviceId: 'desktop', value: { padding: '2rem' } },
            ],
          },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('p-4')
      expect(result.jsx).toContain('sm:p-6')
      expect(result.jsx).toContain('lg:p-8')
    })

    it('transforms image elements', () => {
      const schema: ElementSchema = {
        type: 'Image',
        tagName: 'img',
        controls: {
          image: {
            type: 'Image',
            value: { src: '/image.jpg', alt: 'Description' },
          },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('<img')
      expect(result.jsx).toContain('src="/image.jpg"')
      expect(result.jsx).toContain('alt="Description"')
      expect(result.jsx).toContain('/>')
    })

    it('transforms link elements', () => {
      const schema: ElementSchema = {
        type: 'Link',
        tagName: 'a',
        controls: {
          link: {
            type: 'Link',
            value: { href: '/about', target: '_blank' },
          },
          content: { type: 'TextInput', value: 'About Us' },
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('<a')
      expect(result.jsx).toContain('href="/about"')
      expect(result.jsx).toContain('target="_blank"')
      expect(result.jsx).toContain('About Us')
    })

    it('transforms nested children', () => {
      const schema: ElementSchema = {
        type: 'Container',
        tagName: 'div',
        controls: {
          style: {
            type: 'Style',
            properties: ['padding'],
            value: [{ deviceId: 'mobile', value: { padding: '1rem' } }],
          },
        },
        children: {
          type: 'Slot',
          elements: [
            {
              type: 'Heading',
              tagName: 'h1',
              controls: {
                content: { type: 'TextInput', value: 'Title' },
              },
            },
            {
              type: 'Paragraph',
              tagName: 'p',
              controls: {
                content: { type: 'TextInput', value: 'Description' },
              },
            },
          ],
        },
      }

      const result = transformSchemaToJSX(schema)
      expect(result.jsx).toContain('<div className="p-4">')
      expect(result.jsx).toContain('<h1>Title</h1>')
      expect(result.jsx).toContain('<p>Description</p>')
      expect(result.jsx).toContain('</div>')
    })

    it('parses JSON string input', () => {
      const jsonInput = JSON.stringify({
        type: 'Container',
        tagName: 'div',
        controls: {
          content: { type: 'TextInput', value: 'Hello' },
        },
      })

      const result = transformSchemaToJSX(jsonInput)
      expect(result.jsx).toBe('<div>Hello</div>')
    })

    it('handles array of schemas', () => {
      const schemas: ElementSchema[] = [
        {
          type: 'Container',
          tagName: 'div',
          controls: { content: { type: 'TextInput', value: 'First' } },
        },
        {
          type: 'Container',
          tagName: 'div',
          controls: { content: { type: 'TextInput', value: 'Second' } },
        },
      ]

      const result = transformSchemaToJSX(schemas)
      expect(result.jsx).toContain('<div>First</div>')
      expect(result.jsx).toContain('<div>Second</div>')
    })
  })

  describe('schemaToJSXString', () => {
    it('returns just the JSX string', () => {
      const schema: ElementSchema = {
        type: 'Container',
        tagName: 'div',
        controls: {
          content: { type: 'TextInput', value: 'Hello' },
        },
      }

      const jsx = schemaToJSXString(schema)
      expect(jsx).toBe('<div>Hello</div>')
    })
  })
})
