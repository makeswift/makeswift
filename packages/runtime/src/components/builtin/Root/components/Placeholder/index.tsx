import { forwardRef } from 'react'
import { useStyle } from '../../../../../runtimes/react/use-style'

export default forwardRef<HTMLDivElement>(function Placeholder(_props, ref) {
  return (
    <div
      ref={ref}
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
