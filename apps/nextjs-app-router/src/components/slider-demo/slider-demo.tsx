'use client'

type Props = {
  className?: string
  volume?: number
  opacity?: number
}

export default function SliderDemo({ className, volume, opacity }: Props) {
  const volumeVal = volume ?? 50
  const opacityVal = opacity ?? 1

  return (
    <div className={className}>
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800">Slider Control Demo</h2>

        <div className="space-y-4">
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
      </div>
    </div>
  )
}
