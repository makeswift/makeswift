import { Range, Point, Path, Location } from 'slate'

export const LocationUtils = {
  getStartPath(location: Location): Path {
    if (Range.isRange(location)) return Range.start(location).path
    if (Point.isPoint(location)) return location.path
    return location
  },
}
