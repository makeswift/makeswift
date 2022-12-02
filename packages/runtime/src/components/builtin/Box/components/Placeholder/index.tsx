import { forwardRef, Ref } from 'react'
import { useStyle } from '../../../../../runtimes/react/use-style'

type Props = { hide?: boolean }

export default forwardRef(function Placeholder(
  { hide = false, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      {...restOfProps}
      ref={ref}
      style={{ visibility: hide ? 'hidden' : 'initial' }}
      className={useStyle({
        width: '100%',
        background: 'rgba(161, 168, 194, 0.18)',
        height: 80,
        padding: 8,
      })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          strokeWidth={2}
          strokeDasharray="4 2"
          fill="none"
          stroke="rgba(161, 168, 194, 0.40)"
          rx="4"
          ry="4"
        />
      </svg>
    </div>
  )
})
