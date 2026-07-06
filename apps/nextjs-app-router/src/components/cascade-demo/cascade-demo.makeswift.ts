import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import { Style, unstable_Cascade } from '@makeswift/runtime/controls'

type Pokemon = { name: string; url: string }

// Subset of PokéAPI's `sprites` object; every field is a nullable image URL.
type PokemonSprites = {
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

// PokéAPI (free, no auth): pokemon (combobox) → sprite (images). Both
// `getOptions` run in the builder; PokéAPI allows client-side CORS.
const POKEAPI = 'https://pokeapi.co/api/v2'
const MAX_COMBOBOX_RESULTS = 50

// No search endpoint: fetch the list once and cache the in-flight promise so
// keystrokes reuse it instead of refetching.
let pokemonListPromise: Promise<Pokemon[]> | null = null
function loadPokemonList(): Promise<Pokemon[]> {
  pokemonListPromise ??= fetch(`${POKEAPI}/pokemon?limit=1500`)
    .then((res) => res.json())
    .then((data: { results: Pokemon[] }) => data.results)
    .catch(() => {
      // Reset so a later call can retry after a transient failure.
      pokemonListPromise = null
      return []
    })
  return pokemonListPromise
}

// Flatten the useful sprite URLs into image options, dropping any that are null.
function spriteOptions(
  sprites: PokemonSprites,
): { id: string; image: string; text: string }[] {
  const candidates: { id: string; image: string | null; text: string }[] = [
    {
      id: 'official-artwork',
      image: sprites.other?.['official-artwork']?.front_default ?? null,
      text: 'Official artwork',
    },
    { id: 'front-default', image: sprites.front_default, text: 'Front' },
    { id: 'back-default', image: sprites.back_default, text: 'Back' },
    { id: 'front-shiny', image: sprites.front_shiny, text: 'Front (shiny)' },
    { id: 'back-shiny', image: sprites.back_shiny, text: 'Back (shiny)' },
    {
      id: 'dream-world',
      image: sprites.other?.dream_world?.front_default ?? null,
      text: 'Dream World',
    },
    {
      id: 'home',
      image: sprites.other?.home?.front_default ?? null,
      text: 'Home',
    },
  ]
  return candidates.filter(
    (o): o is { id: string; image: string; text: string } => o.image != null,
  )
}

runtime.registerComponent(
  lazy(() => import('./cascade-demo')),
  {
    type: 'Cascade Control Demo',
    label: 'Custom / Cascade Control Demo',
    props: {
      className: Style(),
      selection: unstable_Cascade({
        label: 'Pokémon sprite',
        stages: [
          {
            key: 'pokemon',
            display: 'combobox',
            getOptions: async (query: string) => {
              const list = await loadPokemonList()
              const q = query.toLowerCase()
              return list
                .filter((p) => p.name.includes(q))
                .slice(0, MAX_COMBOBOX_RESULTS)
                .map((p) => ({ id: p.name, value: p, label: p.name }))
            },
          },
          {
            key: 'sprite',
            display: 'images',
            getOptions: async (ctx) => {
              const pokemon = ctx?.selections.pokemon as
                | { value?: Pokemon }
                | undefined
              const name = pokemon?.value?.name
              if (name == null) return { options: [] }

              try {
                const res = await fetch(`${POKEAPI}/pokemon/${name}`)
                const data: { sprites: PokemonSprites } = await res.json()
                return { options: spriteOptions(data.sprites) }
              } catch {
                return { options: [] }
              }
            },
          },
        ],
      }),
    },
  },
)
