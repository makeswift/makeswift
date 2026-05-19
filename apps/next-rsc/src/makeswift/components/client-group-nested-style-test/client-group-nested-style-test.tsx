type Props = {
  groupA: {
    className: string
  },
  groupB: {
    className: string
  }
}

export function ClientGroupNestedStyleTest({ groupA, groupB }: Props) {
  return (
    <>
      <div className={groupA.className} style={{ backgroundColor: 'red' }}>Div A</div>
      <div className={groupB.className} style={{ backgroundColor: 'blue' }}>Div B</div>
    </>
  )
}
