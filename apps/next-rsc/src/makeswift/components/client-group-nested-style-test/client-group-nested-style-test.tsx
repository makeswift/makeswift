type Props = {
  groupA: {
    classNameA: string
  },
  groupB: {
    classNameB: string
  }
}

export function ClientGroupNestedStyleTest({ groupA, groupB }: Props) {
  return (
    <>
      <div className={groupA.classNameA} style={{ backgroundColor: 'red' }}>Div A</div>
      <div className={groupB.classNameB} style={{ backgroundColor: 'blue' }}>Div B</div>
    </>
  )
}