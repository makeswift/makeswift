import React from "react"

export function Sphere({ radius = 9, color = "#000000", opacity = 0.7 }) {
  return (
    <mesh castShadow>
      <sphereBufferGeometry attach="geometry" args={[radius, 128, 128]} />
      <meshPhongMaterial
        attach="material"
        opacity={opacity}
        shininess={20}
        color={color}
        transparent
      />
    </mesh>
  )
}
