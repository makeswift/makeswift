'use server'

type Props = {
  classNameA?: string
  classNameB?: string
  children: React.ReactNode
  colorA?: string
  colorB?: string
}

export async function RscJoseph(props: Props) {

  return (
    <>
      <div className={props.classNameA} style={{ backgroundColor: props.colorA }}>Div A</div>
      <div className={props.classNameB} style={{ backgroundColor: props.colorB }}>Div B</div>
      <div>{props.children}</div>
    </>
  )
}
