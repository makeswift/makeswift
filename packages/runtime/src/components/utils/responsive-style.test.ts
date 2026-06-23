import { responsiveWidth } from './responsive-style'

const breakpoints = [
  { id: 'desktop', label: 'Desktop', viewportWidth: 1280 },
]

const MEDIA_QUERY = '@media only screen'

describe('responsiveWidth', () => {
  test('emits pixel width for px unit', () => {
    const widthData = [{ deviceId: 'desktop', value: { value: 200, unit: 'px' as const } }]

    const result = responsiveWidth(breakpoints, widthData)

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: '200px' },
    })
  })

  test('emits percentage width for % unit', () => {
    const widthData = [{ deviceId: 'desktop', value: { value: 50, unit: '%' as const } }]

    const result = responsiveWidth(breakpoints, widthData)

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: '50%' },
    })
  })

  test('emits fit-content for auto when autoWidth is not provided', () => {
    const widthData = [{ deviceId: 'desktop', value: 'auto' as const }]

    const result = responsiveWidth(breakpoints, widthData)

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: 'fit-content', minWidth: 20 },
    })
  })

  test('emits pixel width for auto with numeric autoWidth (image intrinsic)', () => {
    const widthData = [{ deviceId: 'desktop', value: 'auto' as const }]

    const result = responsiveWidth(breakpoints, widthData, { autoWidth: 800 })

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: '800px' },
    })
  })

  test('uses default value when no data provided', () => {
    const result = responsiveWidth(breakpoints, undefined)

    expect(result).toMatchObject({ maxWidth: '100%' })
  })

  test('uses custom string default when no data provided', () => {
    const result = responsiveWidth(breakpoints, undefined, { defaultValue: 'auto' })

    expect(result).toMatchObject({ maxWidth: '100%' })
  })

  test('falls back to autoWidth when no data and defaultValue is auto (button)', () => {
    const result = responsiveWidth(breakpoints, undefined, {
      defaultValue: 'auto',
      autoWidth: 'fit-content',
    })

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: 'fit-content', minWidth: 20 },
    })
  })

  test('falls back to intrinsic pixel width when no data (image)', () => {
    const result = responsiveWidth(breakpoints, undefined, {
      defaultValue: 800,
      autoWidth: 800,
    })

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: 800 },
    })
  })

  test('uses default minWidth when minWidth is explicitly undefined', () => {
    const widthData = [{ deviceId: 'desktop', value: 'auto' as const }]

    const result = responsiveWidth(breakpoints, widthData, { minWidth: undefined })

    expect(result).toMatchObject({
      maxWidth: '100%',
      [MEDIA_QUERY]: { width: 'fit-content', minWidth: 20 },
    })
  })
})
