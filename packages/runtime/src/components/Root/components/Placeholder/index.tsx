import { forwardRef } from 'react'
import styled from 'styled-components'

const PlaceholderBase = styled.div`
  width: 100%;
  background: rgba(161, 168, 194, 0.18);
  height: 80px;
  padding: 8px;
`

type Props = Record<string, never>

export default forwardRef<HTMLDivElement, Props>(function Placeholder(props: Props, ref) {
  return (
    <PlaceholderBase {...props} ref={ref}>
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
    </PlaceholderBase>
  )
})
