import { createReplacementContext } from "../../context"
import { typographyWithoutId } from "./__fixtures__/typography-without-id"
import { unstable_Typography } from "./typography"

describe('Copying Typography', () => {
  test('allows for undefined id', () => {
    const result = unstable_Typography().copyData(typographyWithoutId, {
      replacementContext: createReplacementContext(),
      copyElement: (e) => e,
    })

    expect(result).toMatchSnapshot('Output data from copying a typography without an id')
  })
})
