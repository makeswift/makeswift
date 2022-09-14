const GLOBE_RADIUS = 9.2

export function polar2Cartesian(lat, lng, r = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = lng * (Math.PI / 180)

  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    -r * Math.sin(phi) * Math.sin(theta),
  ]
}
