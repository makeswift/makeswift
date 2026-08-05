type Props = {
  className?: string
  stateName?: string | null
  cityName?: string | null
}

export function ControlContextDemo({ className, stateName, cityName }: Props) {
  return (
    <div className={className}>
      {stateName && cityName ? (
        <p>{`Welcome to ${cityName}, ${stateName}!`}</p>
      ) : (
        <p>Please select a location</p>
      )}
    </div>
  )
}

export default ControlContextDemo
