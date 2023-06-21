import { forwardRef, Ref } from 'react'
import { useStyle } from '../../../runtimes/react/use-style'
import Warning20 from '../../icons/warning-20.svg'

type Props = {
  text: string
}

export const FallbackComponent = forwardRef(function FallbackComponent(
  { text }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={useStyle({
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
      })}
    >
      <Warning20 />
      <span>{text}</span>
    </div>
  )
})
