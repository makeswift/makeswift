import { Ref, forwardRef } from 'react'

type Props = {
  className?: string
  fontWithoutVariantWithoutDefault?: {
    fontFamily: string
  }
  fontWithVariantWithoutDefault?: {
    fontFamily: string
    fontStyle: string
    fontWeight: number
  }
  fontWithoutVariantWithDefault: {
    fontFamily: string
  }
  fontWithVariantWithDefault: {
    fontFamily: string
    fontStyle: string
    fontWeight: number
  }
  text?: string
}

export const FontControlDemo = forwardRef(function FontControlDemo(
  {
    className,
    fontWithoutVariantWithoutDefault,
    fontWithVariantWithoutDefault,
    fontWithoutVariantWithDefault,
    fontWithVariantWithDefault,
    text,
  }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={'flex flex-col p-3 w-full text-3xl' + ' ' + className}
      ref={ref}
    >
      <div style={{ ...fontWithoutVariantWithoutDefault }}>
        {text ?? 'Font w/o variant w/o default value control demo'}
      </div>
      <div style={{ ...fontWithVariantWithoutDefault }}>
        {text ?? 'Font w/ variant w/o default value control demo'}
      </div>
      <div style={{ ...fontWithoutVariantWithDefault }}>
        {text ?? 'Font w/o variant w/ default value control demo'}
      </div>
      <div style={{ ...fontWithVariantWithDefault }}>
        {text ?? 'Font w/ variant w/ default value control demo'}
      </div>
      <pre className="text-sm">
        {JSON.stringify(
          {
            text,
            fontWithoutVariantWithoutDefault,
            fontWithVariantWithoutDefault,
            fontWithoutVariantWithDefault,
            fontWithVariantWithDefault,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
})

export default FontControlDemo
