import React from 'react'

export default function Button({ children = 'Click me!' }: { children: React.ReactNode }) {
  return <button>{children}</button>
}