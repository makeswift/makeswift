import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated, config } from "@react-spring/three"
import { polar2Cartesian } from "../services/utils"

const tempObject = new THREE.Object3D()
const center = new THREE.Vector3(0, 0, 0)

export function Location({
  lat = 0,
  lng = 0,
  count = 3,
  stroke = 0.02,
  color = "#fff",
  frequency = 75,
  size = 10,
  radius = 9.2,
}) {
  const group = useRef()
  const rings = useRef()

  useFrame(() => {
    group.current.lookAt(center)
  })

  useFrame(() => {
    tempObject.updateMatrix()
    rings.current.setMatrixAt(2, tempObject.matrix)
    rings.current.instanceMatrix.needsUpdate = true
  })

  const { scale, opacity } = useSpring({
    from: {
      scale: 0.5,
      opacity: 1,
    },
    to: {
      scale: 2.5,
      opacity: 0,
    },
    duration: Math.floor(Math.random() * 1000) + 1000,
    delay: Math.floor(Math.random() * (25000 / frequency)) + 500,
    loop: true,
    config: config.slow,
  })

  return (
    <group ref={group} position={polar2Cartesian(lat, lng, radius)}>
      <mesh>
        <sphereGeometry args={[size / 100, 128, 128]} />
        <meshPhongMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <animated.instancedMesh
        scale={scale}
        ref={rings}
        args={[null, null, count]}
      >
        <animated.ringBufferGeometry
          attach="geometry"
          opacity={opacity}
          args={[(size + 5) / 100, (size + 5) / 100 + stroke, 128]}
        />
        <animated.meshPhongMaterial
          transparent={true}
          opacity={opacity}
          color={color}
          side={THREE.DoubleSide}
        />
      </animated.instancedMesh>
    </group>
  )
}
