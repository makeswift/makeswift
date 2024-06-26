import { describe, expect, test } from 'vitest'

import { enhancedTypography } from '../typography'
import * as Fixtures from './fixtures/typography'

describe('GIVEN enhancedTypography', () => {
  test('WHEN hierarchical typography data is passed THEN style overrides are correctly flattened', () => {
    const result = enhancedTypography(
      Fixtures.typographyValue,
      Fixtures.baseTypography,
      Fixtures.breakpoints,
      Fixtures.swatches,
    )

    expect(result).toMatchSnapshot()
  })
})
