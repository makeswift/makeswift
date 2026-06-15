'use client'

type Props = {
  className?: string
  eventDate?: string
  startsAt?: string
}

function formatDate(iso?: string) {
  return iso == null ? '—' : new Date(iso).toLocaleDateString()
}

function formatDateTime(iso?: string) {
  return iso == null ? '—' : new Date(iso).toLocaleString()
}

export default function DateDemo({ className, eventDate, startsAt }: Props) {
  return (
    <div className={className}>
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800">Date Control Demo</h2>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Event date (date only)</span>
              <span className="font-mono">{formatDate(eventDate)}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono break-all">
              {eventDate ?? 'undefined'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Starts at (with time)</span>
              <span className="font-mono">{formatDateTime(startsAt)}</span>
            </div>
            <div className="text-xs text-gray-400 font-mono break-all">
              {startsAt ?? 'undefined'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
