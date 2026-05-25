type Props = {
  className?: string
  text?: string
}

export function ClientStyleV2Test({ className, text }: Props) {
  return (
    <div
      className={className}
      style={{
        padding: 24,
        border: '1px solid #99c',
        fontFamily: 'monospace',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  )
}
