import { Targets } from '../../../introspection'

import * as Fixtures from '../__fixtures__'

import { introspectRichTextData } from './introspection'

describe('GIVEN introspecting RichText v1', () => {
  test.each([
    [Targets.Swatch, [Fixtures.SWATCH_ID]],
    [Targets.Typography, [Fixtures.TYPOGRAPHY_ID]],
    [Targets.Page, [Fixtures.PAGE_ID]],
  ])(
    'WHEN target is %s THEN correct ids are returned (%o)',
    (target, expected) => {
      expect(
        introspectRichTextData(Fixtures.introspection, target),
      ).toStrictEqual(expected)
    },
  )
})
