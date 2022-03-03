import { forwardRef, Ref } from 'react'
import styled from 'styled-components'

const PlaceholderBase = styled.div<{ hide: boolean }>`
  width: 100%;
  background: rgba(161, 168, 194, 0.18);
  height: 80px;
  padding: 8px;
  visibility: ${({ hide }) => (hide === true ? 'hidden' : 'initial')};
`

type Props = { hide?: boolean }

export default forwardRef(function Placeholder(
  { hide = false, ...restOfProps }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <PlaceholderBase {...restOfProps} hide={hide} ref={ref}>
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
