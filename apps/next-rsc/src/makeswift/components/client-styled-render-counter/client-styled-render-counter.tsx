import { useRef } from "react"


type Props = {
  className?: string
}

export function ClientStyledRenderCounter({ className }: Props) {

  const renderCountRef = useRef<number>(0)
  ++renderCountRef.current

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 16, backgroundColor: 'gray' }}>
      <h1>Client Component</h1>
      <div style={{ width: '100%', height: '100%', backgroundColor: 'lightgray', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} className={className}>
        <h2>Styled Element</h2>
        <p>Render count: {renderCountRef.current}</p>
      </div>
    </div>
  )
}