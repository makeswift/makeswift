import { type GalleryOption } from '@makeswift/runtime/controls'

// Matches the `value` shape returned by the `Combobox`'s `getOptions` (Combobox
// resolves to the selected option's `value`, not the whole `{ id, value, label }`).
type Pokemon = { name: string; url: string }

type Props = {
  className?: string
  pokemon?: Pokemon
  sprite?: GalleryOption
}

export function PokemonDemo({ className, pokemon, sprite }: Props) {
  return (
    <div className={className}>
      <p>Selected Pokémon: {pokemon?.name ?? '(none)'}</p>
      {sprite != null ? (
        <img src={sprite.src} alt={sprite.label ?? ''} style={{ maxWidth: 240 }} />
      ) : (
        <p>(no sprite selected)</p>
      )}
    </div>
  )
}

export default PokemonDemo
