import { ComponentPropsWithoutRef } from 'react'

import { TypographyMarkValue, overrideTypographyStyle } from './hooks/useTypographyMark'

export type { TypographyMarkValue }
export { overrideTypographyStyle }

type BaseProps = { value: TypographyMarkValue }

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>

export default function Mark({ value, ...restOfProps }: Props): JSX.Element {
  return <span {...restOfProps} />
}
