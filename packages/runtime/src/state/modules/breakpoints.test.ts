import { parseBreakpointsInput } from './breakpoints'

describe('parseBreakpointsInput', () => {
  // Desktop-first cascading: base breakpoint (Desktop) has no maxWidth,
  // other breakpoints use only maxWidth for proper CSS cascading without gaps.
  // Desktop's minWidth is for display/canvas purposes only, NOT used in media queries.
  test('adds the base breakpoint', async () => {
    // Arrange
    const input = {
      tablet: { width: 768 },
      mobile: { width: 575 },
    }

    // Act
    const result = parseBreakpointsInput(input)

    // Assert
    expect(result).toEqual([
      { id: 'desktop', label: 'Desktop', minWidth: 768 },
      { id: 'tablet', maxWidth: 768, viewportWidth: 768 },
      { id: 'mobile', maxWidth: 575, viewportWidth: 575 },
    ])
  })

  test('sorts the input breakpoint in descending order', async () => {
    // Arrange
    const input = {
      mobile: { width: 575 },
      tablet: { width: 768 },
    }

    // Act
    const result = parseBreakpointsInput(input)

    // Assert
    expect(result).toEqual([
      { id: 'desktop', label: 'Desktop', minWidth: 768 },
      { id: 'tablet', maxWidth: 768, viewportWidth: 768 },
      { id: 'mobile', maxWidth: 575, viewportWidth: 575 },
    ])
  })

  test('accepts more breakpoints', async () => {
    // Arrange
    const input = {
      tablet: { width: 768 },
      mobile: { width: 575 },
      pager: { width: 300 },
      ant: { width: 100 },
    }

    // Act
    const result = parseBreakpointsInput(input)

    // Assert
    expect(result).toEqual([
      { id: 'desktop', label: 'Desktop', minWidth: 768 },
      { id: 'tablet', maxWidth: 768, viewportWidth: 768 },
      { id: 'mobile', maxWidth: 575, viewportWidth: 575 },
      { id: 'pager', maxWidth: 300, viewportWidth: 300 },
      { id: 'ant', maxWidth: 100, viewportWidth: 100 },
    ])
  })

  test('accepts label option', async () => {
    // Arrange
    const input = {
      tablet: { width: 768, label: 'iPad' },
      mobile: { width: 575, label: 'iPhone 76' },
    }

    // Act
    const result = parseBreakpointsInput(input)

    // Assert
    expect(result).toEqual([
      { id: 'desktop', label: 'Desktop', minWidth: 768 },
      { id: 'tablet', label: 'iPad', maxWidth: 768, viewportWidth: 768 },
      { id: 'mobile', label: 'iPhone 76', maxWidth: 575, viewportWidth: 575 },
    ])
  })

  test('accepts viewport option', async () => {
    // Arrange
    const input = {
      tablet: { width: 768, viewport: 700 },
      mobile: { width: 575, viewport: 300 },
    }

    // Act
    const result = parseBreakpointsInput(input)

    // Assert
    expect(result).toEqual([
      { id: 'desktop', label: 'Desktop', minWidth: 768 },
      { id: 'tablet', maxWidth: 768, viewportWidth: 700 },
      { id: 'mobile', maxWidth: 575, viewportWidth: 300 },
    ])
  })

  test('throws an error if you try to set the base breakpoint "desktop"', async () => {
    // Arrange
    const input = {
      desktop: { width: 1080 },
      tablet: { width: 768 },
      mobile: { width: 575 },
    }

    // Act
    // Assert
    expect(() => parseBreakpointsInput(input)).toThrowError(/base breakpoint/)
  })

  test('throws an error if the the input is an empty object', async () => {
    // Arrange
    const input = {}

    // Act
    // Assert
    expect(() => parseBreakpointsInput(input)).toThrowError(/cannot be empty/)
  })

  test('throws an error if a viewport is bigger than its width', async () => {
    // Arrange
    const input = {
      tablet: { width: 768 },
      mobile: { width: 575, viewport: 600 },
    }

    // Act
    // Assert
    expect(() => parseBreakpointsInput(input)).toThrowError(
      /Viewport cannot be greater than its width/,
    )
  })

  test('throws an error if a viewport is smaller than the next width', async () => {
    // Arrange
    const input = {
      tablet: { width: 768, viewport: 300 },
      mobile: { width: 575 },
    }

    // Act
    // Assert
    expect(() => parseBreakpointsInput(input)).toThrowError(
      /Viewport cannot be smaller than the next breakpoint's width/,
    )
  })

  test('throws an error if there are two breakpoints that have the same width', async () => {
    // Arrange
    const input = {
      tablet: { width: 500 },
      mobile: { width: 500 },
    }

    // Act
    // Assert
    expect(() => parseBreakpointsInput(input)).toThrowError(
      /Breakpoints cannot have the same width/,
    )
  })
})
