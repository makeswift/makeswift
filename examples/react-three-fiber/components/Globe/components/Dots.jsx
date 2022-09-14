import * as THREE from "three"
import { useRef, useEffect } from "react"
import { useLoader } from "@react-three/fiber"

const centerVector = new THREE.Vector3(0, 0, 0)
const tempObject = new THREE.Object3D()

const getDistance = (circlePosition) => {
  const distance = new THREE.Vector3()
  distance.subVectors(centerVector, circlePosition).normalize()
  const { x, y, z } = distance
  const cordX = 1 - (0.5 + Math.atan2(z, x) / (2 * Math.PI))
  const cordY = 0.5 + Math.asin(y) / Math.PI
  return new THREE.Vector2(cordX, cordY)
}

const getAlpha = (distanceVector, imgData) => {
  const { width, height } = imgData
  const { x, y } = distanceVector
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

export function Dots({
  count = 20000,
  radius = 6.2,
  dotRadius = 4,
  color = "#ffffff",
}) {
  const ref = useRef()
  const mapElement = useLoader(THREE.ImageLoader, "/map.png")

  useEffect(() => {
    const imageData = getImageData(mapElement)

    for (let b = 0; b < count; b++) {
      const phi = Math.acos(-1 + (2 * b) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const { x, y, z } = new THREE.Vector3(0, 0, 0).setFromSphericalCoords(
        radius,
        phi,
        theta
      )

      tempObject.lookAt(centerVector)
      tempObject.position.set(x, y, z)
      const alpha = getAlpha(getDistance({ x, y, z }), imageData)

      if (alpha > 0) {
        tempObject.updateMatrix()
        ref.current.setMatrixAt(b, tempObject.matrix)
      }
    }

    ref.current.instanceMatrix.needsUpdate = true
  }, [count, mapElement, radius])

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <circleBufferGeometry attach="geometry" args={[dotRadius / 100, 6]} />
      <meshPhongMaterial
        attach="material"
        side={THREE.DoubleSide}
        color={color}
      />
    </instancedMesh>
  )
}
