import { forwardRef, Ref, ReactNode } from 'react'
import { composeStyles, useStyle } from '../../../../../runtimes/react/css-runtime/hooks/use-style'

function Label() {
  const labelStyle = useStyle({
    maxWidth: 120,
    minWidth: 60,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#a1a8c2',
    opacity: 0.4,
    marginBottom: 8,
  })
  return (
    <>
      {labelStyle.styleElement}
      <div
        className={labelStyle.className}
      />
    </>
  )
}

function Input() {
  const inputStyle = useStyle({
    minWidth: 80,
    height: 32,
    borderRadius: 4,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#a1a8c2',
    opacity: 0.4,
  })
  return (
    <>
      {inputStyle.styleElement}
      <div
        className={inputStyle.className}
      />
    </>
  )
}

function Button() {
  const buttonStyle = useStyle({
    minWidth: 140,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#a1a8c2',
    opacity: 0.4,
  })
  return (
    <>
      {buttonStyle.styleElement}
      <div
        className={buttonStyle.className}
      />
    </>
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
): ReactNode {
  const styles = composeStyles(
    useStyle({ display: 'flex', flexDirection: 'column' }),
    width,
    margin,
    className
  )
  return (
    <>
      {styles.styleElements}
      <div
        ref={ref}
        className={styles.className}
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
    </>
  )
})
