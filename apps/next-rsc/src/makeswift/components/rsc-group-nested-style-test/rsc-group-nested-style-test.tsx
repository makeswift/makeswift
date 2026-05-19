type Props = {
  groupA?: {
    className?: string
  },
  groupB?: {
    className?: string
  }
}

export function RSCGroupNestedStyleTest({ groupA, groupB }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <h1>RSC Group Nested Style Test</h1>
      <div className={groupA?.className} style={{ backgroundColor: 'lightgray' }}>Styled Element A</div>
      <div className={groupB?.className} style={{ backgroundColor: 'lightgray' }}>Styled Element B</div>
    </div>
  )
}