type Pokemon = { name: string; url: string }

type Props = {
  className?: string
  pokemon?: { generation?: number; selection?: Pokemon }
  sprite?: string
}

export function PokemonDemo({ className, pokemon, sprite }: Props) {
  return (
    <div className={className}>
      <p>Selected Pokémon: {pokemon?.selection?.name ?? '(none)'}</p>
      {sprite != null ? (
        <img src={sprite} alt={sprite ?? ''} style={{ maxWidth: 240 }} />
      ) : (
        <p>(no sprite selected)</p>
      )}
    </div>
  )
}

export default PokemonDemo
