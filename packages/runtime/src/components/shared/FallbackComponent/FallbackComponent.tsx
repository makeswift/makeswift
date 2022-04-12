import { forwardRef, Ref } from 'react'
import styled from 'styled-components'
import { ReactComponent as Warning20 } from '../../icons/warning-20.svg'

const ErrorDiv = styled('div')`
  width: 100%;
  height: 54px;
  background-color: #fcedf2;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c73e6d;
  fill: currentColor;
  font-family: Heebo, sans-serif;
  font-size: 16px;
`

type Props = {
  text: string
}

export const FallbackComponent = forwardRef(function FallbackComponent(
  { text }: Props,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <ErrorDiv ref={ref}>
      <Warning20 />
      <span>{text}</span>
    </ErrorDiv>
  )
})
