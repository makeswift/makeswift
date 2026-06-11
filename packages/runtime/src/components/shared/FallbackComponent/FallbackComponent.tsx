import { forwardRef, Ref } from 'react'
import { Warning20 } from '../../icons/Warning20'
import { useStyle } from '../../../runtimes/react/css-runtime/hooks/use-style'

type Props = {
  text: string
  details?: string
}

export const FallbackComponent = forwardRef(function FallbackComponent(
  { text, details }: Props,
  ref: Ref<HTMLDivElement>,
) {
  const { className: outerClassName, styleElement: outerStyleElement } = useStyle({
    width: '100%',
    height: 54,
    backgroundColor: '#fcedf2',
    borderRadius: 6,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#c73e6d',
    fill: 'currentColor',
    fontFamily: 'Heebo, sans-serif',
    fontSize: 16,
  })
  const { className: noDisplayClassName, styleElement: noDisplayStyleElement } = useStyle({ display: 'none' })
  return (
    <>
      {outerStyleElement}
      <div
        ref={ref}
        className={outerClassName}
      >
        {noDisplayStyleElement}
        <Warning20 />
        <span>{text}</span>
        <span className={noDisplayClassName}>{details}</span>
      </div>
    </>
  )
})
