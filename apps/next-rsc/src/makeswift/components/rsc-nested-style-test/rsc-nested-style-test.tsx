import 'server-only'

type Props = {
  className?: string
  children: React.ReactNode
}

export function RscNestedStyleTest({ className, children }: Props) {
  return (
    // OUTER WRAPPER = component root (the "main path" sees this rectangle).
    // Tall + wide + outlined so you can see exactly where the component handle is.
    <div
      style={{
        position: 'relative',
        width: 600,
        padding: 80,
        background: 'rgba(255,0,0,0.15)',
        outline: '2px dashed red',
      }}
    >
      <div style={{ marginBottom: 24, color: 'red', font: 'bold 12px monospace' }}>
        OUTER WRAPPER (component root)
      </div>
      {/* SLOT — children unaffected by Style() */}
      <div style={{ background: 'rgba(0,0,255,0.15)', padding: 16, marginBottom: 24 }}>
        {children}
      </div>
      {/*
        STYLED ELEMENT.
        - Smaller than the outer wrapper.
        - Offset to the right.
        - Outlined in green so it's obvious where the styled rectangle is.
        - The Style() className lands HERE.
      */}
      <div
        className={className}
        style={{
          width: 200,
          marginLeft: 200,
          padding: 16,
          background: 'rgba(0,255,0,0.25)',
          outline: '2px dashed green',
        }}
      >
        <div style={{ color: 'green', font: 'bold 12px monospace' }}>
          STYLED ELEMENT (className lands here)
        </div>
      </div>
    </div>
  )
}