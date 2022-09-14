import { Canvas as ThreeCanvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Dots } from "./components/Dots"
import { Location } from "./components/Location"
import React, { Suspense } from "react"
import { polar2Cartesian } from "./services/utils"
import { Sphere } from "./components/Sphere"

type Props = {
  className?: string
  radius?: number
  dotsOffset?: number
  locationsOffset?: number
  locations?: ({ lat: number; lng: number } | undefined | null)[]
  dotCount?: number
  dotRadius?: number
  dotsColor?: string
  sphereColor?: string
  sphereOpacity?: number
  locationsColor?: string
  rotateSpeed?: number
}

export function Globe({
  className,
  radius = 9,
  dotsOffset = 2,
  locationsOffset = 2,
  locations = [],
  dotCount,
  dotRadius,
  dotsColor,
  sphereColor,
  sphereOpacity,
  locationsColor,
  rotateSpeed,
}: Props) {
  return (
    <div className={className}>
      <ThreeCanvas
        style={{ aspectRatio: "1/1" }}
        camera={{
          position: polar2Cartesian(33.749, -84.388),
          fov: 60,
          near: 5,
          far: 130,
        }}
      >
        {locations.map(
          (location) =>
            location && (
              <Location
                key={`${location.lat},${location.lng}`}
                color={locationsColor}
                radius={radius + locationsOffset / 10}
                {...location}
              />
            )
        )}
        <ambientLight />
        <Sphere radius={radius} color={sphereColor} opacity={sphereOpacity} />
        <Suspense fallback={null}>
          <Dots
            radius={radius + dotsOffset / 10}
            count={dotCount}
            dotRadius={dotRadius}
            color={dotsColor}
          />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={rotateSpeed}
          minDistance={20}
          minPolarAngle={Math.PI * 0.35}
          maxPolarAngle={Math.PI * 0.55}
          enableZoom={false}
          enablePan={false}
        />
      </ThreeCanvas>
    </div>
  )
}
