import { transformJSX, transformJSXToJSON } from '../transform'
import type { TextInputControlValue, TextAreaControlValue, RichTextControlValue } from '../types'

describe('transformJSX', () => {
  it('transforms a simple div with Tailwind classes', () => {
    const jsx = `<div className="m-4 p-6 bg-blue-500 rounded-lg">Hello</div>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)
    expect(result.schemas).toHaveLength(1)

    const schema = result.schemas[0]
    expect(schema.type).toBe('Container')
    expect(schema.tagName).toBe('div')
    expect(schema.controls.style).toBeDefined()
    expect(schema.controls.backgroundColor).toBeDefined()
    expect(schema.controls.content).toBeDefined()
    expect((schema.controls.content as TextInputControlValue).value).toBe('Hello')
  })

  it('transforms responsive Tailwind classes', () => {
    const jsx = `<div className="p-4 md:p-8 lg:p-12">Content</div>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    const styleControl = schema.controls.style

    expect(styleControl).toBeDefined()
    expect(styleControl?.type).toBe('Style')

    if (styleControl?.type === 'Style') {
      expect(styleControl.value.length).toBeGreaterThan(1)
    }

    expect((schema.controls.content as TextInputControlValue).value).toBe('Content')
  })

  it('transforms heading elements correctly', () => {
    const jsx = `<h1 className="text-2xl font-bold text-gray-900">Welcome</h1>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.type).toBe('Heading')
    expect(schema.tagName).toBe('h1')
    expect(schema.controls.typography).toBeDefined()
    expect(schema.controls.textColor).toBeDefined()
    expect(schema.controls.content).toBeDefined()
    expect(schema.controls.content?.type).toBe('TextInput')
    expect((schema.controls.content as TextInputControlValue).value).toBe('Welcome')
  })

  it('transforms nested elements with children', () => {
    const jsx = `
      <div className="flex flex-col gap-4">
        <h1 className="text-xl">Title</h1>
        <p className="text-gray-600">Description</p>
      </div>
    `

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.children).toBeDefined()
    expect(schema.children?.type).toBe('Slot')
    expect(schema.children?.elements).toHaveLength(2)
  })

  it('preserves original class names when option is enabled', () => {
    const jsx = `<div className="m-4 p-6">Hello</div>`

    const result = transformJSX(jsx, { preserveOriginalClasses: true })

    expect(result.schemas[0].metadata?.originalClassName).toBe('m-4 p-6')
  })

  it('handles state variants when option is enabled', () => {
    const jsx = `<button className="bg-blue-500 hover:bg-blue-600">Click</button>`

    const result = transformJSX(jsx, { includeStateVariants: true })

    expect(result.schemas[0].metadata?.stateVariants).toBeDefined()
    expect(result.schemas[0].metadata?.stateVariants?.hover).toBeDefined()
    expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Click')
  })

  it('handles images correctly', () => {
    const jsx = `<img src="/image.png" alt="An image" className="w-full rounded" />`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.type).toBe('Image')
    expect(schema.controls.style).toBeDefined()
  })

  it('handles buttons correctly', () => {
    const jsx = `<button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.type).toBe('Button')
    expect(schema.controls.style).toBeDefined()
    expect(schema.controls.backgroundColor).toBeDefined()
    expect(schema.controls.textColor).toBeDefined()
    expect(schema.controls.content).toBeDefined()
    expect(schema.controls.content?.type).toBe('TextInput')
    expect((schema.controls.content as TextInputControlValue).value).toBe('Submit')
  })

  it('handles links correctly', () => {
    const jsx = `<a href="/about" className="text-blue-500 underline">About Us</a>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.type).toBe('Link')
    expect(schema.controls.content).toBeDefined()
    expect(schema.controls.content?.type).toBe('TextInput')
    expect((schema.controls.content as TextInputControlValue).value).toBe('About Us')
  })

  it('reports parsing errors for invalid JSX', () => {
    const jsx = `<div className="m-4"`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(1)
    expect(result.schemas).toHaveLength(0)
  })

  it('handles arbitrary Tailwind values', () => {
    const jsx = `<div className="w-[300px] h-[200px] bg-[#ff0000]">Custom</div>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.controls.style).toBeDefined()
    expect(schema.controls.backgroundColor).toBeDefined()
    expect((schema.controls.content as TextInputControlValue).value).toBe('Custom')
  })

  it('handles negative margin values', () => {
    const jsx = `<div className="-mt-4 -ml-2">Offset</div>`

    const result = transformJSX(jsx)

    expect(result.errors).toHaveLength(0)

    const schema = result.schemas[0]
    expect(schema.controls.style).toBeDefined()
    expect((schema.controls.content as TextInputControlValue).value).toBe('Offset')
  })

  describe('paragraph and text elements', () => {
    it('transforms a simple paragraph with short text as TextInput', () => {
      const jsx = `<p className="text-gray-600">Short text</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Paragraph')
      expect(schema.tagName).toBe('p')
      expect(schema.controls.content).toBeDefined()
      expect(schema.controls.content?.type).toBe('TextInput')
      expect((schema.controls.content as TextInputControlValue).value).toBe('Short text')
    })

    it('transforms a paragraph with longer text as TextArea', () => {
      const longText = 'This is a much longer paragraph that exceeds the short text threshold and should be treated as a TextArea control for better editing experience.'
      const jsx = `<p className="text-gray-600 leading-relaxed">${longText}</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Paragraph')
      expect(schema.controls.content).toBeDefined()
      expect(schema.controls.content?.type).toBe('TextArea')
      expect((schema.controls.content as TextAreaControlValue).value).toBe(longText)
    })

    it('transforms a paragraph with inline formatting as RichText', () => {
      const jsx = `<p className="text-base">This has <strong>bold</strong> and <em>italic</em> text</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Paragraph')
      expect(schema.controls.content).toBeDefined()
      expect(schema.controls.content?.type).toBe('RichText')
      expect((schema.controls.content as RichTextControlValue).value).toBe('This has bold and italic text')
    })

    it('transforms span with short text as TextInput', () => {
      const jsx = `<span className="text-sm text-gray-500">Label text</span>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Text')
      expect(schema.controls.content?.type).toBe('TextInput')
      expect((schema.controls.content as TextInputControlValue).value).toBe('Label text')
    })

    it('transforms blockquote correctly', () => {
      const jsx = `<blockquote className="border-l-4 border-gray-300 pl-4 italic">A wise quote</blockquote>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.style).toBeDefined()
      expect(schema.controls.content).toBeDefined()
      expect((schema.controls.content as TextInputControlValue).value).toBe('A wise quote')
    })
  })

  describe('rich text scenarios', () => {
    it('detects rich content with nested anchor tag', () => {
      const jsx = `<p>Click <a href="/link">here</a> for more info</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.content?.type).toBe('RichText')
      expect((schema.controls.content as RichTextControlValue).value).toBe('Click here for more info')
    })

    it('detects rich content with code tag', () => {
      const jsx = `<p>Use the <code>console.log()</code> function</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.content?.type).toBe('RichText')
      expect((schema.controls.content as RichTextControlValue).value).toBe('Use the console.log() function')
    })

    it('handles complex nested structure with multiple formatting', () => {
      const jsx = `
        <p className="text-lg leading-7">
          This is <strong>important</strong> and this is <em>emphasized</em>.
          Also check <a href="/docs" className="text-blue-500">the docs</a>.
        </p>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Paragraph')
      expect(schema.controls.content?.type).toBe('RichText')
      expect(schema.controls.typography).toBeDefined()
      expect((schema.controls.content as RichTextControlValue).value).toContain('important')
      expect((schema.controls.content as RichTextControlValue).value).toContain('emphasized')
      expect((schema.controls.content as RichTextControlValue).value).toContain('the docs')
    })

    it('handles article with multiple paragraphs', () => {
      const jsx = `
        <article className="prose">
          <h1>Title</h1>
          <p>First paragraph</p>
          <p>Second paragraph with <strong>bold</strong> text</p>
        </article>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Container')
      expect(schema.children?.elements).toHaveLength(3)

      const heading = schema.children?.elements[0]
      expect((heading?.controls.content as TextInputControlValue).value).toBe('Title')

      const firstPara = schema.children?.elements[1]
      expect(firstPara?.controls.content?.type).toBe('TextInput')
      expect((firstPara?.controls.content as TextInputControlValue).value).toBe('First paragraph')

      const secondPara = schema.children?.elements[2]
      expect(secondPara?.controls.content?.type).toBe('RichText')
      expect((secondPara?.controls.content as RichTextControlValue).value).toBe('Second paragraph with bold text')
    })

    it('handles div with mixed content', () => {
      const jsx = `
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Section Title</h2>
          <p className="text-gray-600">Description text here</p>
          <button className="bg-blue-500 text-white px-4 py-2">Action</button>
        </div>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.children?.elements).toHaveLength(3)

      expect(schema.children?.elements[0].type).toBe('Heading')
      expect((schema.children?.elements[0].controls.content as TextInputControlValue).value).toBe('Section Title')

      expect(schema.children?.elements[1].type).toBe('Paragraph')
      expect((schema.children?.elements[1].controls.content as TextInputControlValue).value).toBe('Description text here')

      expect(schema.children?.elements[2].type).toBe('Button')
      expect((schema.children?.elements[2].controls.content as TextInputControlValue).value).toBe('Action')
    })
  })

  describe('heading variations', () => {
    it('transforms all heading levels correctly', () => {
      const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

      for (const tag of headings) {
        const jsx = `<${tag} className="font-bold">Heading</${tag}>`
        const result = transformJSX(jsx)

        expect(result.errors).toHaveLength(0)
        expect(result.schemas[0].type).toBe('Heading')
        expect(result.schemas[0].tagName).toBe(tag)
        expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Heading')
      }
    })

    it('transforms heading with link inside as RichText', () => {
      const jsx = `<h2>Check out <a href="/page">this page</a></h2>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Heading')
      expect(schema.controls.content?.type).toBe('RichText')
      expect((schema.controls.content as RichTextControlValue).value).toBe('Check out this page')
    })
  })

  describe('list elements', () => {
    it('transforms unordered list correctly', () => {
      const jsx = `
        <ul className="list-disc pl-4">
          <li>Item one</li>
          <li>Item two</li>
          <li>Item three</li>
        </ul>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('List')
      expect(schema.children?.elements).toHaveLength(3)

      expect((schema.children?.elements[0].controls.content as TextInputControlValue).value).toBe('Item one')
      expect((schema.children?.elements[1].controls.content as TextInputControlValue).value).toBe('Item two')
      expect((schema.children?.elements[2].controls.content as TextInputControlValue).value).toBe('Item three')
    })

    it('transforms ordered list correctly', () => {
      const jsx = `
        <ol className="list-decimal pl-4">
          <li>First step</li>
          <li>Second step</li>
        </ol>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('List')

      expect((schema.children?.elements[0].controls.content as TextInputControlValue).value).toBe('First step')
      expect((schema.children?.elements[1].controls.content as TextInputControlValue).value).toBe('Second step')
    })

    it('handles list items with rich content', () => {
      const jsx = `
        <ul>
          <li>Simple item</li>
          <li>Item with <strong>bold</strong> text</li>
        </ul>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const firstItem = result.schemas[0].children?.elements[0]
      expect(firstItem?.controls.content?.type).toBe('TextInput')
      expect((firstItem?.controls.content as TextInputControlValue).value).toBe('Simple item')

      const secondItem = result.schemas[0].children?.elements[1]
      expect(secondItem?.controls.content?.type).toBe('RichText')
      expect((secondItem?.controls.content as RichTextControlValue).value).toBe('Item with bold text')
    })
  })

  describe('typography styling', () => {
    it('handles multiple text size classes', () => {
      const jsx = `<p className="text-sm md:text-base lg:text-lg">Responsive text</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.typography).toBeDefined()
      expect((schema.controls.content as TextInputControlValue).value).toBe('Responsive text')

      if (schema.controls.typography?.type === 'Typography') {
        expect(schema.controls.typography.value.length).toBeGreaterThan(1)
      }
    })

    it('handles text alignment classes', () => {
      const jsx = `<p className="text-center md:text-left">Aligned text</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)
      expect(result.schemas[0].controls.typography).toBeDefined()
      expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Aligned text')
    })

    it('handles text decoration classes', () => {
      const jsx = `<span className="underline">Underlined text</span>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)
      expect(result.schemas[0].controls.typography).toBeDefined()
      expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Underlined text')
    })

    it('handles font weight variations', () => {
      const jsx = `<p className="font-light md:font-normal lg:font-bold">Weight variation</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)
      expect(result.schemas[0].controls.typography).toBeDefined()
      expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Weight variation')
    })

    it('handles line height and letter spacing', () => {
      const jsx = `<p className="leading-loose tracking-wide">Spaced text</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)
      expect(result.schemas[0].controls.typography).toBeDefined()
      expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Spaced text')
    })

    it('handles text transform classes', () => {
      const jsx = `<span className="uppercase">uppercase text</span>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)
      expect(result.schemas[0].controls.typography).toBeDefined()
      expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('uppercase text')
    })

    it('handles italic text', () => {
      const jsx = `<em className="italic text-gray-500">Emphasized text</em>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)
      expect(result.schemas[0].controls.typography).toBeDefined()
      expect((result.schemas[0].controls.content as TextInputControlValue).value).toBe('Emphasized text')
    })
  })

  describe('responsive classes', () => {
    it('handles responsive margin classes across all breakpoints', () => {
      const jsx = `<div className="m-4 sm:m-3 md:m-2 lg:m-8 xl:m-12">Responsive margins</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.style).toBeDefined()
      expect(schema.controls.style?.type).toBe('Style')

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(3)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle).toBeDefined()
        expect(mobileStyle?.value.margin).toBe('1rem')

        const tabletStyle = styleValue.find(v => v.deviceId === 'tablet')
        expect(tabletStyle).toBeDefined()
        expect(tabletStyle?.value.margin).toBe('0.75rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle).toBeDefined()
        expect(desktopStyle?.value.margin).toBe('3rem')
      }
    })

    it('handles responsive padding classes', () => {
      const jsx = `<div className="p-2 sm:p-4 md:p-6 lg:p-8">Responsive padding</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(3)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.padding).toBe('0.5rem')

        const tabletStyle = styleValue.find(v => v.deviceId === 'tablet')
        expect(tabletStyle?.value.padding).toBe('1rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.padding).toBe('2rem')
      }
    })

    it('handles responsive gap classes', () => {
      const jsx = `<div className="flex gap-2 md:gap-4 lg:gap-8">Responsive gap</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.gap).toBe('0.5rem')
        expect(mobileStyle?.value.display).toBe('flex')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.gap).toBe('2rem')
      }
    })

    it('handles responsive width classes', () => {
      const jsx = `<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">Responsive width</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.width).toBe('100%')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.width).toBe('25%')
      }
    })

    it('handles responsive flex direction', () => {
      const jsx = `<div className="flex flex-col md:flex-row">Responsive direction</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.display).toBe('flex')
        expect(mobileStyle?.value.flexDirection).toBe('column')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.flexDirection).toBe('row')
      }
    })

    it('handles responsive text colors', () => {
      const jsx = `<p className="text-gray-600 md:text-gray-800 lg:text-black">Responsive color</p>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.textColor).toBeDefined()
      expect(schema.controls.textColor?.type).toBe('Color')

      if (schema.controls.textColor?.type === 'Color') {
        const colorValue = schema.controls.textColor.value

        expect(colorValue.length).toBe(2)

        const mobileColor = colorValue.find(v => v.deviceId === 'mobile')
        expect(mobileColor?.value.color).toBe('#4b5563')

        const desktopColor = colorValue.find(v => v.deviceId === 'desktop')
        expect(desktopColor?.value.color).toBe('#000000')
      }
    })

    it('handles responsive background colors', () => {
      const jsx = `<div className="bg-white md:bg-gray-100 lg:bg-gray-200">Responsive bg</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.backgroundColor).toBeDefined()

      if (schema.controls.backgroundColor?.type === 'Color') {
        const colorValue = schema.controls.backgroundColor.value

        expect(colorValue.length).toBe(2)

        const mobileColor = colorValue.find(v => v.deviceId === 'mobile')
        expect(mobileColor?.value.color).toBe('#ffffff')

        const desktopColor = colorValue.find(v => v.deviceId === 'desktop')
        expect(desktopColor?.value.color).toBe('#e5e7eb')
      }
    })

    it('handles responsive typography with font size', () => {
      const jsx = `<h1 className="text-xl md:text-2xl lg:text-4xl xl:text-6xl">Big heading</h1>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.controls.typography).toBeDefined()

      if (schema.controls.typography?.type === 'Typography') {
        const typographyValue = schema.controls.typography.value

        expect(typographyValue.length).toBe(2)

        const mobileTypo = typographyValue.find(v => v.deviceId === 'mobile')
        expect(mobileTypo?.value.fontSize).toBe('1.25rem')

        const desktopTypo = typographyValue.find(v => v.deviceId === 'desktop')
        expect(desktopTypo?.value.fontSize).toBe('3.75rem')
      }

      expect((schema.controls.content as TextInputControlValue).value).toBe('Big heading')
    })

    it('handles responsive border radius', () => {
      const jsx = `<div className="rounded md:rounded-lg lg:rounded-xl">Rounded box</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.borderRadius).toBe('0.25rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.borderRadius).toBe('0.75rem')
      }
    })

    it('handles 2xl breakpoint', () => {
      const jsx = `<div className="p-4 2xl:p-16">Extra large padding</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.padding).toBe('1rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.padding).toBe('4rem')
      }
    })

    it('handles combined responsive layout classes', () => {
      const jsx = `
        <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-8 md:p-8 lg:gap-12 lg:p-12">
          Layout container
        </div>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.display).toBe('flex')
        expect(mobileStyle?.value.flexDirection).toBe('column')
        expect(mobileStyle?.value.gap).toBe('1rem')
        expect(mobileStyle?.value.padding).toBe('1rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.flexDirection).toBe('row')
        expect(desktopStyle?.value.gap).toBe('3rem')
        expect(desktopStyle?.value.padding).toBe('3rem')
      }
    })

    it('handles responsive hidden/block display', () => {
      const jsx = `<div className="hidden md:block lg:flex">Responsive visibility</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.display).toBe('none')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.display).toBe('flex')
      }
    })

    it('handles responsive max-width classes', () => {
      const jsx = `<div className="max-w-sm md:max-w-md lg:max-w-xl xl:max-w-4xl">Responsive max-width</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.maxWidth).toBe('24rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.maxWidth).toBe('56rem')
      }
    })

    it('handles mixed responsive and non-responsive classes', () => {
      const jsx = `<div className="bg-blue-500 text-white rounded-lg p-4 md:p-8 lg:p-12">Mixed classes</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      expect(schema.controls.backgroundColor).toBeDefined()
      if (schema.controls.backgroundColor?.type === 'Color') {
        expect(schema.controls.backgroundColor.value.length).toBe(1)
        expect(schema.controls.backgroundColor.value[0].deviceId).toBe('mobile')
      }

      expect(schema.controls.textColor).toBeDefined()

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.borderRadius).toBe('0.5rem')
        expect(mobileStyle?.value.padding).toBe('1rem')

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.padding).toBe('3rem')
      }
    })

    it('larger Tailwind breakpoints override smaller ones for desktop', () => {
      const jsx = `<div className="p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">Breakpoint precedence</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const desktopStyle = styleValue.find(v => v.deviceId === 'desktop')
        expect(desktopStyle?.value.padding).toBe('3rem')
      }
    })

    it('handles sm breakpoint mapping to tablet', () => {
      const jsx = `<div className="p-2 sm:p-4">Tablet breakpoint</div>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.style?.type === 'Style') {
        const styleValue = schema.controls.style.value

        expect(styleValue.length).toBe(2)

        const mobileStyle = styleValue.find(v => v.deviceId === 'mobile')
        expect(mobileStyle?.value.padding).toBe('0.5rem')

        const tabletStyle = styleValue.find(v => v.deviceId === 'tablet')
        expect(tabletStyle?.value.padding).toBe('1rem')
      }
    })
  })

  describe('image elements', () => {
    it('extracts src and alt from img element', () => {
      const jsx = `<img src="/hero.jpg" alt="Hero image" className="w-full rounded-lg" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Image')
      expect(schema.tagName).toBe('img')

      expect(schema.controls.image).toBeDefined()
      expect(schema.controls.image?.type).toBe('Image')

      if (schema.controls.image?.type === 'Image') {
        expect(schema.controls.image.value.src).toBe('/hero.jpg')
        expect(schema.controls.image.value.alt).toBe('Hero image')
      }
    })

    it('extracts width and height from img element', () => {
      const jsx = `<img src="/logo.png" width={200} height={100} />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.image?.type === 'Image') {
        expect(schema.controls.image.value.src).toBe('/logo.png')
        expect(schema.controls.image.value.width).toBe(200)
        expect(schema.controls.image.value.height).toBe(100)
      }
    })

    it('extracts width and height as strings', () => {
      const jsx = `<img src="/photo.jpg" width="300" height="200" alt="Photo" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.image?.type === 'Image') {
        expect(schema.controls.image.value.width).toBe(300)
        expect(schema.controls.image.value.height).toBe(200)
      }
    })

    it('handles img with only src', () => {
      const jsx = `<img src="/simple.jpg" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.image?.type === 'Image') {
        expect(schema.controls.image.value.src).toBe('/simple.jpg')
        expect(schema.controls.image.value.alt).toBeUndefined()
        expect(schema.controls.image.value.width).toBeUndefined()
        expect(schema.controls.image.value.height).toBeUndefined()
      }
    })

    it('combines image control with style controls', () => {
      const jsx = `<img src="/styled.jpg" alt="Styled" className="w-full h-auto rounded-xl shadow-lg" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      expect(schema.controls.image).toBeDefined()
      expect(schema.controls.style).toBeDefined()

      if (schema.controls.image?.type === 'Image') {
        expect(schema.controls.image.value.src).toBe('/styled.jpg')
      }

      if (schema.controls.style?.type === 'Style') {
        expect(schema.controls.style.properties).toContain('width')
        expect(schema.controls.style.properties).toContain('borderRadius')
      }
    })

    it('handles external image URLs', () => {
      const jsx = `<img src="https://example.com/image.png" alt="External image" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      if (result.schemas[0].controls.image?.type === 'Image') {
        expect(result.schemas[0].controls.image.value.src).toBe('https://example.com/image.png')
      }
    })
  })

  describe('link elements', () => {
    it('extracts href from anchor element', () => {
      const jsx = `<a href="/about">About Us</a>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Link')
      expect(schema.tagName).toBe('a')

      expect(schema.controls.link).toBeDefined()
      expect(schema.controls.link?.type).toBe('Link')

      if (schema.controls.link?.type === 'Link') {
        expect(schema.controls.link.value.href).toBe('/about')
      }

      expect(schema.controls.content).toBeDefined()
      expect((schema.controls.content as TextInputControlValue).value).toBe('About Us')
    })

    it('extracts href and target from anchor element', () => {
      const jsx = `<a href="https://example.com" target="_blank">External Link</a>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.link?.type === 'Link') {
        expect(schema.controls.link.value.href).toBe('https://example.com')
        expect(schema.controls.link.value.target).toBe('_blank')
      }

      expect((schema.controls.content as TextInputControlValue).value).toBe('External Link')
    })

    it('handles anchor with styles', () => {
      const jsx = `<a href="/contact" className="text-blue-500 hover:underline font-bold">Contact</a>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      expect(schema.controls.link).toBeDefined()
      expect(schema.controls.textColor).toBeDefined()
      expect(schema.controls.typography).toBeDefined()
    })

    it('handles internal page links', () => {
      const jsx = `<a href="#section-1">Jump to Section</a>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      if (result.schemas[0].controls.link?.type === 'Link') {
        expect(result.schemas[0].controls.link.value.href).toBe('#section-1')
      }
    })

    it('handles mailto links', () => {
      const jsx = `<a href="mailto:hello@example.com">Email Us</a>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      if (result.schemas[0].controls.link?.type === 'Link') {
        expect(result.schemas[0].controls.link.value.href).toBe('mailto:hello@example.com')
      }
    })

    it('handles tel links', () => {
      const jsx = `<a href="tel:+1234567890">Call Us</a>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      if (result.schemas[0].controls.link?.type === 'Link') {
        expect(result.schemas[0].controls.link.value.href).toBe('tel:+1234567890')
      }
    })
  })

  describe('button elements', () => {
    it('extracts button content', () => {
      const jsx = `<button>Click Me</button>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Button')
      expect(schema.tagName).toBe('button')

      expect(schema.controls.content).toBeDefined()
      expect((schema.controls.content as TextInputControlValue).value).toBe('Click Me')
    })

    it('handles button with styles', () => {
      const jsx = `<button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      expect(schema.controls.content).toBeDefined()
      expect(schema.controls.style).toBeDefined()
      expect(schema.controls.backgroundColor).toBeDefined()
      expect(schema.controls.textColor).toBeDefined()

      expect((schema.controls.content as TextInputControlValue).value).toBe('Submit')
    })

    it('handles button with link attribute', () => {
      const jsx = `<button href="/action">Action Button</button>`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      if (schema.controls.link?.type === 'Link') {
        expect(schema.controls.link.value.href).toBe('/action')
      }

      expect((schema.controls.content as TextInputControlValue).value).toBe('Action Button')
    })
  })

  describe('video elements', () => {
    it('extracts video src', () => {
      const jsx = `<video src="/video.mp4" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.tagName).toBe('video')

      expect(schema.controls.video).toBeDefined()
      expect(schema.controls.video?.type).toBe('TextInput')

      if (schema.controls.video?.type === 'TextInput') {
        expect(schema.controls.video.value).toBe('/video.mp4')
      }
    })

    it('extracts video poster', () => {
      const jsx = `<video src="/video.mp4" poster="/thumbnail.jpg" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      expect(schema.controls.video).toBeDefined()
      expect(schema.controls.poster).toBeDefined()

      if (schema.controls.poster?.type === 'Image') {
        expect(schema.controls.poster.value.src).toBe('/thumbnail.jpg')
      }
    })

    it('handles video with styles', () => {
      const jsx = `<video src="/intro.mp4" className="w-full rounded-lg" />`

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]

      expect(schema.controls.video).toBeDefined()
      expect(schema.controls.style).toBeDefined()

      if (schema.controls.style?.type === 'Style') {
        expect(schema.controls.style.properties).toContain('width')
        expect(schema.controls.style.properties).toContain('borderRadius')
      }
    })
  })

  describe('complex nested structures', () => {
    it('handles card with image and content', () => {
      const jsx = `
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src="/card-image.jpg" alt="Card" className="w-full rounded-t-lg" />
          <h2 className="text-xl font-bold mt-4">Card Title</h2>
          <p className="text-gray-600">Card description goes here.</p>
          <a href="/read-more" className="text-blue-500">Read More</a>
        </div>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Container')
      expect(schema.children).toBeDefined()

      if (schema.children?.type === 'Slot') {
        expect(schema.children.elements.length).toBe(4)

        const imgElement = schema.children.elements[0]
        expect(imgElement.type).toBe('Image')
        expect(imgElement.controls.image).toBeDefined()

        const headingElement = schema.children.elements[1]
        expect(headingElement.type).toBe('Heading')
        expect(headingElement.controls.content).toBeDefined()

        const paragraphElement = schema.children.elements[2]
        expect(paragraphElement.type).toBe('Paragraph')

        const linkElement = schema.children.elements[3]
        expect(linkElement.type).toBe('Link')
        expect(linkElement.controls.link).toBeDefined()
      }
    })

    it('handles navigation with multiple links', () => {
      const jsx = `
        <nav className="flex gap-4">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.tagName).toBe('nav')

      if (schema.children?.type === 'Slot') {
        expect(schema.children.elements.length).toBe(3)

        for (const linkElement of schema.children.elements) {
          expect(linkElement.type).toBe('Link')
          expect(linkElement.controls.link).toBeDefined()
          expect(linkElement.controls.content).toBeDefined()
        }
      }
    })

    it('handles hero section with image, heading, text, and CTA', () => {
      const jsx = `
        <section className="bg-gray-100 p-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Site</h1>
          <p className="text-xl text-gray-600 mt-4">The best place to find what you need.</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-6">Get Started</button>
        </section>
      `

      const result = transformJSX(jsx)

      expect(result.errors).toHaveLength(0)

      const schema = result.schemas[0]
      expect(schema.type).toBe('Container')
      expect(schema.tagName).toBe('section')

      if (schema.children?.type === 'Slot') {
        expect(schema.children.elements.length).toBe(3)

        const h1 = schema.children.elements[0]
        expect(h1.type).toBe('Heading')
        expect((h1.controls.content as TextInputControlValue).value).toBe('Welcome to Our Site')

        const p = schema.children.elements[1]
        expect(p.type).toBe('Paragraph')

        const button = schema.children.elements[2]
        expect(button.type).toBe('Button')
        expect((button.controls.content as TextInputControlValue).value).toBe('Get Started')
      }
    })
  })
})

describe('transformJSXToJSON', () => {
  it('returns valid JSON string', () => {
    const jsx = `<div className="m-4">Hello</div>`

    const json = transformJSXToJSON(jsx)

    expect(() => JSON.parse(json)).not.toThrow()

    const parsed = JSON.parse(json)
    expect(parsed.type).toBe('Container')
  })

  it('returns error JSON for invalid input', () => {
    const jsx = `<div className="m-4"`

    const json = transformJSXToJSON(jsx)
    const parsed = JSON.parse(json)

    expect(parsed.errors).toBeDefined()
    expect(parsed.errors.length).toBeGreaterThan(0)
  })
})
