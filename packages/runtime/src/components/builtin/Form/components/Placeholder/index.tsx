import { forwardRef, Ref } from 'react'
import styled from 'styled-components'

import { MarginValue, WidthValue } from '../../../../../prop-controllers/descriptors'
import { cssMargin } from '../../../../utils/cssMediaRules'

const Container = styled.div<{
  width?: WidthValue
  margin?: MarginValue
}>`
  display: flex;
  flex-direction: column;
  ${cssMargin()};
`

const Label = styled.div`
  max-width: 120px;
  min-width: 60px;
  height: 8px;
  border-radius: 2px;
  background-color: #a1a8c2;
  opacity: 0.4;
  margin-bottom: 8px;
`

const Input = styled.div`
  min-width: 80px;
  height: 32px;
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;
  border-color: #a1a8c2;
  opacity: 0.4;
`

const Button = styled.div`
  min-width: 140px;
  height: 32px;
  border-radius: 4px;
  background-color: #a1a8c2;
  opacity: 0.4;
`

type Props = {
  className?: string
  margin?: MarginValue
}

export default forwardRef(function Placeholder(
  { className, margin }: Props,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  return (
    <Container ref={ref} className={className} margin={margin}>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <Label />
        <Input />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <Label />
        <Input />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Button />
      </div>
    </Container>
  )
})
