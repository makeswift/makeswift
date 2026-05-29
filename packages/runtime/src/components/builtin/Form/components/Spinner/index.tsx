import { ReactNode } from 'react'
import { Spinner20 } from '../../../../icons/Spinner20'
import { useKeyframes } from '../../../../../runtimes/react/css-runtime/hooks/use-keyframes'
import { useStyle } from '../../../../../runtimes/react/css-runtime/hooks/use-style'

export default function Spinner(): ReactNode {
  const keyframesStyle = useKeyframes(`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `)
  const spinnerStyle = useStyle({
    display: 'inline-flex',
    animation: `${keyframesStyle.keyframesName} 1s linear infinite`,
    stroke: 'currentColor',
  })
  return (
    <>
      {keyframesStyle.styleElement}
      {spinnerStyle.styleElement}
      <Spinner20
        className={spinnerStyle.className}
      />
    </>
  )
}
