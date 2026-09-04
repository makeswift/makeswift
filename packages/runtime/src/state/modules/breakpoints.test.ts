import { parseBreakpointsInput } from './breakpoints'

describe('parseBreakpointsInput', () => {
  describe('default breakpoint configuration', () => {
    test('accepts only a default breakpoint with viewport and label', async () => {
      // Arrange
      const input = {
        default: { viewport: 780, label: 'Tablet' },
      }

      // Act
      const result = parseBreakpointsInput(input)

      // Assert
      expect(result).toEqual([{ id: 'desktop', label: 'Tablet', viewportWidth: 780 }])
    })

    test('accepts only a default breakpoint with just viewport', async () => {
      // Arrange
      const input = {
        default: { viewport: 780 },
      }

      // Act
      const result = parseBreakpointsInput(input)

      // Assert
      expect(result).toEqual([{ id: 'desktop', label: 'Desktop', viewportWidth: 780 }])
    })

    test('accepts only a default breakpoint with just label', async () => {
      // Arrange
      const input = {
        default: { label: 'Tablet' },
      }

      // Act
      const result = parseBreakpointsInput(input)

      // Assert
      expect(result).toEqual([{ id: 'desktop', label: 'Tablet' }])
    })

    test('accepts default with other breakpoints', async () => {
      // Arrange
      const input = {
        default: { viewport: 1200, label: 'Large' },
        tablet: { width: 768 },
        mobile: { width: 575 },
      }

      // Act
      const result = parseBreakpointsInput(input)

      // Assert
      expect(result).toEqual([
        { id: 'desktop', label: 'Large', minWidth: 769, viewportWidth: 1200 },
        { id: 'tablet', minWidth: 576, maxWidth: 768, viewportWidth: 768 },
        { id: 'mobile', maxWidth: 575, viewportWidth: 575 },
      ])
    })

    test('default label overrides the base breakpoint label', async () => {
      // Arrange
      const input = {
        default: { label: 'Custom Base' },
        tablet: { width: 768 },
      }

      // Act
      const result = parseBreakpointsInput(input)

      // Assert
      expect(result).toEqual([
        { id: 'desktop', label: 'Custom Base', minWidth: 769 },
        { id: 'tablet', maxWidth: 768, viewportWidth: 768 },
      ])
    })

    test('default viewport sets the base breakpoint viewportWidth', async () => {
      // Arrange
      const input = {
        default: { viewport: 1024 },
        tablet: { width: 768 },
      }

      // Act
      const result = parseBreakpointsInput(input)

      // Assert
      expect(result).toEqual([
        { id: 'desktop', label: 'Desktop', minWidth: 769, viewportWidth: 1024 },
        { id: 'tablet', maxWidth: 768, viewportWidth: 768 },
      ])
    })
  })

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
      { id: 'desktop', label: 'Desktop', minWidth: 769 },
      { id: 'tablet', minWidth: 576, maxWidth: 768, viewportWidth: 768 },
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
      { id: 'desktop', label: 'Desktop', minWidth: 769 },
      { id: 'tablet', minWidth: 576, maxWidth: 768, viewportWidth: 768 },
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
      { id: 'desktop', label: 'Desktop', minWidth: 769 },
      { id: 'tablet', minWidth: 576, maxWidth: 768, viewportWidth: 768 },
      { id: 'mobile', minWidth: 301, maxWidth: 575, viewportWidth: 575 },
      { id: 'pager', minWidth: 101, maxWidth: 300, viewportWidth: 300 },
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
      { id: 'desktop', label: 'Desktop', minWidth: 769 },
      { id: 'tablet', label: 'iPad', minWidth: 576, maxWidth: 768, viewportWidth: 768 },
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
      { id: 'desktop', label: 'Desktop', minWidth: 769 },
      { id: 'tablet', minWidth: 576, maxWidth: 768, viewportWidth: 700 },
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
    expect(() => parseBreakpointsInput(input)).toThrowError(/Use "default" instead/)
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
