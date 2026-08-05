export type Pokemon = { name: string; url: string }

// Subset of PokéAPI's `sprites` object
export type PokemonSprites = {
  front_default: string | null
  back_default: string | null
  front_shiny: string | null
  back_shiny: string | null
  other?: {
    'official-artwork'?: { front_default: string | null }
    dream_world?: { front_default: string | null }
    home?: { front_default: string | null }
  }
}

const POKEAPI = 'https://pokeapi.co/api/v2'

// No search endpoint: fetch the list once and cache the in-flight promise so
// keystrokes reuse it instead of refetching.
let pokemonListPromises: Map<number, Promise<Pokemon[]>> = new Map()
export function loadPokemonList(generation: number): Promise<Pokemon[]> {
  const existingPromise = pokemonListPromises.get(generation)
  if (existingPromise) {
    return existingPromise
  }

  const newPromise = fetch(`${POKEAPI}/generation/${generation}`)
    .then((res) => res.json())
    .then((data: { pokemon_species: Pokemon[] }) => data.pokemon_species)
    .catch(() => {
      // Reset so a later call can retry after a transient failure.
      pokemonListPromises.delete(generation)
      return []
    })

  pokemonListPromises.set(generation, newPromise)

  return newPromise
}

// Flatten the useful sprite URLs into `unstable_Gallery` options ({ id, src,
// label }), dropping any that are null.
export function spriteOptions(
  sprites: PokemonSprites,
): { id: string; thumbnailUrl: string; label: string; value: string }[] {
  const candidates: {
    id: string
    thumbnailUrl: string | null
    label: string
    value: string | null
  }[] = [
    {
      id: 'official-artwork',
      thumbnailUrl: sprites.other?.['official-artwork']?.front_default ?? null,
      label: 'Official artwork',
      value: sprites.other?.['official-artwork']?.front_default ?? null,
    },
    {
      id: 'front-default',
      thumbnailUrl: sprites.front_default,
      label: 'Front',
      value: sprites.front_default,
    },
    {
      id: 'back-default',
      thumbnailUrl: sprites.back_default,
      label: 'Back',
      value: sprites.back_default,
    },
    {
      id: 'front-shiny',
      thumbnailUrl: sprites.front_shiny,
      label: 'Front (shiny)',
      value: sprites.front_shiny,
    },
    {
      id: 'back-shiny',
      thumbnailUrl: sprites.back_shiny,
      label: 'Back (shiny)',
      value: sprites.back_shiny,
    },
    {
      id: 'dream-world',
      thumbnailUrl: sprites.other?.dream_world?.front_default ?? null,
      label: 'Dream World',
      value: sprites.other?.dream_world?.front_default ?? null,
    },
    {
      id: 'home',
      thumbnailUrl: sprites.other?.home?.front_default ?? null,
      label: 'Home',
      value: sprites.other?.home?.front_default ?? null,
    },
  ]
  return candidates.filter(
    (
      o,
    ): o is {
      id: string
      thumbnailUrl: string
      label: string
      value: string
    } => o.thumbnailUrl != null,
  )
}

export async function loadPokemonSprites(
  name: string,
): Promise<PokemonSprites> {
  const res = await fetch(`${POKEAPI}/pokemon/${name}`)
  const data: { sprites: PokemonSprites } = await res.json()

  return data.sprites
}
