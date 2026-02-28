import { tokenizeTailwindClasses } from '../tailwind/tokenizer'

describe('tokenizeTailwindClasses', () => {
  it('tokenizes basic classes', () => {
    const result = tokenizeTailwindClasses('m-4 p-6 bg-blue-500')

    expect(result.baseClasses).toHaveLength(3)
    expect(result.baseClasses[0].utility).toBe('m')
    expect(result.baseClasses[0].value).toBe('4')
    expect(result.baseClasses[1].utility).toBe('p')
    expect(result.baseClasses[1].value).toBe('6')
    expect(result.baseClasses[2].utility).toBe('bg')
    expect(result.baseClasses[2].value).toBe('blue-500')
  })

  it('parses responsive prefixes', () => {
    const result = tokenizeTailwindClasses('p-4 md:p-8 lg:p-12')

    expect(result.baseClasses).toHaveLength(1)
    expect(result.responsiveClasses['desktop']).toHaveLength(2)
  })

  it('parses state variants', () => {
    const result = tokenizeTailwindClasses('bg-blue-500 hover:bg-blue-600 focus:ring-2')

    expect(result.baseClasses).toHaveLength(1)
    expect(result.stateClasses['hover']).toHaveLength(1)
    expect(result.stateClasses['focus']).toHaveLength(1)
  })

  it('parses arbitrary values', () => {
    const result = tokenizeTailwindClasses('w-[300px] bg-[#ff0000]')

    expect(result.baseClasses).toHaveLength(2)
    expect(result.baseClasses[0].isArbitrary).toBe(true)
    expect(result.baseClasses[0].value).toBe('300px')
    expect(result.baseClasses[1].isArbitrary).toBe(true)
    expect(result.baseClasses[1].value).toBe('#ff0000')
  })

  it('parses negative values', () => {
    const result = tokenizeTailwindClasses('-mt-4 -ml-2')

    expect(result.baseClasses).toHaveLength(2)
    expect(result.baseClasses[0].isNegative).toBe(true)
    expect(result.baseClasses[0].utility).toBe('mt')
    expect(result.baseClasses[1].isNegative).toBe(true)
    expect(result.baseClasses[1].utility).toBe('ml')
  })

  it('handles null input', () => {
    const result = tokenizeTailwindClasses(null)

    expect(result.baseClasses).toHaveLength(0)
  })

  it('handles empty string', () => {
    const result = tokenizeTailwindClasses('')

    expect(result.baseClasses).toHaveLength(0)
  })

  it('parses combined responsive and state variants', () => {
    const result = tokenizeTailwindClasses('md:hover:bg-blue-600')

    expect(result.baseClasses).toHaveLength(0)
  })

  it('parses utility-only classes', () => {
    const result = tokenizeTailwindClasses('flex block hidden')

    expect(result.baseClasses).toHaveLength(3)
    expect(result.baseClasses[0].utility).toBe('flex')
    expect(result.baseClasses[0].value).toBeNull()
  })
})
