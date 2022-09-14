import * as THREE from "three"
import { useMemo } from "react"
import { useLoader } from "@react-three/fiber"

const centerVector = new THREE.Vector3(0, 0, 0)
const globeRadius = 6.2

const getDistance = (circlePosition) => {
  const distance = new THREE.Vector3()
  distance.subVectors(centerVector, circlePosition).normalize()
  const { x, y, z } = distance
  const cordX = 1 - (0.5 + Math.atan2(z, x) / (2 * Math.PI))
  const cordY = 0.5 + Math.asin(y) / Math.PI
  return new THREE.Vector2(cordX, cordY)
}

const getAlpha = ({ x, y }, imgData) => {
  const { width, height } = imgData
  const index = 4 * Math.floor(x * width) + Math.floor(y * height) * (4 * width)
  // 4 because r, g, b, a stored against each pixel
  return imgData.data[index + 3]
}

const getImageData = (imageEl) => {
  const ctx = document.createElement("canvas")
  ctx.width = imageEl.width
  ctx.height = imageEl.height
  const canv = ctx.getContext("2d")
  canv.drawImage(imageEl, 0, 0)

  return canv.getImageData(0, 0, ctx.width, ctx.height)
}

export function Points({ count = 20000, pointSize = 0.08 }) {
  const mapElement = useLoader(THREE.ImageLoader, "./map.png")
  const positions = useMemo(() => {
    const imageData = getImageData(mapElement)
    let positions = []

    for (let b = 0; b < count; b++) {
      const phi = Math.acos(-1 + (2 * b) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const { x, y, z } = new THREE.Vector3(0, 0, 0).setFromSphericalCoords(
        globeRadius,
        phi,
        theta
      )

      if (getAlpha(getDistance({ x, y, z }), imageData)) {
        positions.push(x, y, z)
      }
    }

    return new Float32Array(positions)
  }, [mapElement, count])

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          key={count}
          attachObject={["attributes", "position"]}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        color="#EA3BA7"
        size={pointSize}
        sizeAttenuation
        transparent={false}
      />
    </points>
  )
}
