import { ReactNode } from 'react'
import { keyframes } from '@emotion/css'
import { useStyle } from '../../../../../runtimes/react/use-style'
import { Spinner20 } from '../../../../icons/Spinner20'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export default function Spinner(): ReactNode {
  return (
    <Spinner20
      className={useStyle({
        display: 'inline-flex',
        animation: `${spin} 1s linear infinite`,
        stroke: 'currentColor',
      })}
    />
  )
}
