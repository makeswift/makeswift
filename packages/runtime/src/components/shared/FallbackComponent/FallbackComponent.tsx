import { forwardRef, Ref } from 'react'
import { Warning20 } from '../../icons/Warning20'

type Props = {
  text: string
  details?: string
}

export const FallbackComponent = forwardRef(function FallbackComponent(
  { text, details }: Props,
  ref: Ref<HTMLDivElement>,
) {
  // Intentionally use inline styles so that the fallback doesn't access the style
  // context, the absence of which may be the exact error we're trying to report
  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: 54,
        backgroundColor: '#fcedf2',
        borderRadius: 6,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: '#c73e6d',
      }}
    >
      <Warning20
        style={{
          fill: 'currentColor',
        }}
      />
      <span
        style={{
          color: 'currentColor',
          fontFamily: 'Heebo, sans-serif',
          fontSize: 16,
        }}
      >
        {text}
      </span>
      <span
        style={{
          display: 'none',
        }}
      >
        {details}
      </span>
    </div>
  )
})
