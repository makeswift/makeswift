import styled, { keyframes } from 'styled-components'

import { ReactComponent as Spinner20 } from '../../../../icons/spinner-20.svg'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Icon = styled(Spinner20)`
  display: inline-flex;
  animation: ${spin} 1s linear infinite;
  stroke: currentColor;
`

export default function Spinner(): JSX.Element {
  return <Icon />
}
