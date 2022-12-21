import { cx } from '@emotion/css'
import { forwardRef, Ref } from 'react'

import { useStyle } from '../../../../../runtimes/react/use-style'

function Label() {
  return (
    <div
      className={useStyle({
        maxWidth: 120,
        minWidth: 60,
        height: 8,
        borderRadius: 2,
        backgroundColor: '#a1a8c2',
        opacity: 0.4,
        marginBottom: 8,
      })}
    />
  )
}

function Input() {
  return (
    <div
      className={useStyle({
        minWidth: 80,
        height: 32,
        borderRadius: 4,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#a1a8c2',
        opacity: 0.4,
      })}
    />
  )
}

function Button() {
  return (
    <div
      className={useStyle({
        minWidth: 140,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#a1a8c2',
        opacity: 0.4,
      })}
    />
  )
}

type Props = {
  className?: string
  width?: string
  margin?: string
}

export default forwardRef(function Placeholder(
  { className, width, margin }: Props,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  return (
    <div
      ref={ref}
      className={cx(
        className,
        useStyle({ display: 'flex', flexDirection: 'column' }),
        width,
        margin,
      )}
    >
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
    </div>
  )
})
