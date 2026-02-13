'use client'

// Range value type (matches SliderRangeValue from @makeswift/runtime/controls)
type RangeValue = { start: number; end: number }

// The Slider control returns number | RangeValue depending on the `range` config
type SliderValue = number | RangeValue

type Props = {
  className?: string
  volume?: SliderValue
  opacity?: SliderValue
  priceRange?: SliderValue
  temperatureRange?: SliderValue
}

// Helper to safely get a single number value
function asSingle(value: SliderValue | undefined, fallback: number): number {
  if (value === undefined) return fallback
  if (typeof value === 'number') return value
  return fallback
}

// Helper to safely get a range value
function asRange(
  value: SliderValue | undefined,
  fallback: RangeValue,
): RangeValue {
  if (value === undefined) return fallback
  if (typeof value === 'object' && 'start' in value && 'end' in value)
    return value
  return fallback
}

export default function SliderDemo({
  className,
  volume,
  opacity,
  priceRange,
  temperatureRange,
}: Props) {
  // Extract values with proper types
  const volumeVal = asSingle(volume, 50)
  const opacityVal = asSingle(opacity, 1)
  const priceVal = asRange(priceRange, { start: 0, end: 1000 })
  const tempVal = asRange(temperatureRange, { start: -20, end: 40 })

  return (
    <div className={className}>
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800">Slider Control Demo</h2>

        {/* Single Value Sliders */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Single Value Mode
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Volume</span>
              <span className="font-mono">{volumeVal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${volumeVal}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Opacity</span>
              <span className="font-mono">
                {(opacityVal * 100).toFixed(0)}%
              </span>
            </div>
            <div
              className="w-full h-12 rounded bg-gradient-to-r from-purple-500 to-pink-500 transition-opacity"
              style={{ opacity: opacityVal }}
            />
          </div>
        </div>

        {/* Range Sliders */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Range Mode</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Price Range</span>
              <span className="font-mono">
                ${priceVal.start} - ${priceVal.end}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 relative">
              <div
                className="absolute bg-green-500 h-3 rounded-full transition-all"
                style={{
                  left: `${(priceVal.start / 1000) * 100}%`,
                  width: `${((priceVal.end - priceVal.start) / 1000) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Temperature Range</span>
              <span className="font-mono">
                {tempVal.start}°C - {tempVal.end}°C
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full h-3 relative">
              <div
                className="absolute bg-white/50 h-3 rounded-full border-2 border-gray-800 transition-all"
                style={{
                  left: `${((tempVal.start + 20) / 60) * 100}%`,
                  width: `${((tempVal.end - tempVal.start) / 60) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
