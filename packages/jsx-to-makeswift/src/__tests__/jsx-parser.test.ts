import { parseJSX, parseJSXFragment } from '../parser/jsx-parser'

describe('parseJSX', () => {
  it('parses a simple element', () => {
    const result = parseJSX('<div className="m-4">Hello</div>')

    expect(result.errors).toHaveLength(0)
    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].tagName).toBe('div')
    expect(result.elements[0].className).toBe('m-4')
    expect(result.elements[0].textContent).toBe('Hello')
  })

  it('parses nested elements', () => {
    const result = parseJSX(`
      <div className="container">
        <h1>Title</h1>
        <p>Content</p>
      </div>
    `)

    expect(result.errors).toHaveLength(0)
    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].children).toHaveLength(2)
  })

  it('extracts attributes', () => {
    const result = parseJSX('<img src="/image.png" alt="An image" />')

    expect(result.errors).toHaveLength(0)
    expect(result.elements[0].attributes.src).toBe('/image.png')
    expect(result.elements[0].attributes.alt).toBe('An image')
  })

  it('detects rich content', () => {
    const result = parseJSX('<p>Hello <strong>world</strong></p>')

    expect(result.errors).toHaveLength(0)
    expect(result.elements[0].hasRichContent).toBe(true)
  })

  it('handles self-closing elements', () => {
    const result = parseJSX('<input type="text" />')

    expect(result.errors).toHaveLength(0)
    expect(result.elements).toHaveLength(1)
    expect(result.elements[0].tagName).toBe('input')
    expect(result.elements[0].attributes.type).toBe('text')
  })

  it('handles JSX expressions in className', () => {
    const result = parseJSX('<div className={"m-4"}>Hello</div>')

    expect(result.errors).toHaveLength(0)
    expect(result.elements[0].className).toBe('m-4')
  })

  it('handles custom components', () => {
    const result = parseJSX('<MyComponent prop="value">Content</MyComponent>')

    expect(result.errors).toHaveLength(0)
    expect(result.elements[0].tagName).toBe('MyComponent')
  })

  it('handles member expression components', () => {
    const result = parseJSX('<UI.Button>Click</UI.Button>')

    expect(result.errors).toHaveLength(0)
    expect(result.elements[0].tagName).toBe('UI.Button')
  })

  it('reports errors for invalid JSX', () => {
    const result = parseJSX('<div className="m-4"')

    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('handles boolean attributes', () => {
    const result = parseJSX('<input disabled />')

    expect(result.elements[0].attributes.disabled).toBe(true)
  })

  it('handles numeric attributes', () => {
    const result = parseJSX('<input tabIndex={5} />')

    expect(result.elements[0].attributes.tabIndex).toBe(5)
  })
})

describe('parseJSXFragment', () => {
  it('parses multiple sibling elements', () => {
    const result = parseJSXFragment(`
      <div>First</div>
      <div>Second</div>
    `)

    expect(result.errors).toHaveLength(0)
    expect(result.elements).toHaveLength(2)
  })
})
