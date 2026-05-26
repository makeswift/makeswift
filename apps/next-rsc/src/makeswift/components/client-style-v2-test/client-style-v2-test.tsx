type Props = {
  className?: string
  text?: string
}

export function ClientStyleV2Test({ className, text }: Props) {
  return (
    <div
      className={className}
      style={{
        border: '1px solid #99c',
      }}
    >
      {text}
    </div>
  )
}


