import { runtime } from '@/makeswift/runtime'
import { lazy } from 'react'

import {
  Combobox,
  Style,
  unstable_Gallery,
  unstable_getControlContext,
} from '@makeswift/runtime/controls'

// Ported from the ARR-769 `unstable_Cascade` Pokémon demo. Instead of one
// composite control with `stages`, the spike composes two sibling props and
// pipes the selection through the context seam: `sprite`'s `getOptions` reads
// the selected `pokemon` via `unstable_getControlContext()`.
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

// PokéAPI (free, no auth): pokemon (combobox) → sprite (gallery). Both
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

// Flatten the useful sprite URLs into `unstable_Gallery` options ({ id, src,
// label }), dropping any that are null.
function spriteOptions(
  sprites: PokemonSprites,
): { id: string; src: string; label: string }[] {
  const candidates: { id: string; src: string | null; label: string }[] = [
    {
      id: 'official-artwork',
      src: sprites.other?.['official-artwork']?.front_default ?? null,
      label: 'Official artwork',
    },
    { id: 'front-default', src: sprites.front_default, label: 'Front' },
    { id: 'back-default', src: sprites.back_default, label: 'Back' },
    { id: 'front-shiny', src: sprites.front_shiny, label: 'Front (shiny)' },
    { id: 'back-shiny', src: sprites.back_shiny, label: 'Back (shiny)' },
    {
      id: 'dream-world',
      src: sprites.other?.dream_world?.front_default ?? null,
      label: 'Dream World',
    },
    {
      id: 'home',
      src: sprites.other?.home?.front_default ?? null,
      label: 'Home',
    },
  ]
  return candidates.filter(
    (o): o is { id: string; src: string; label: string } => o.src != null,
  )
}

runtime.registerComponent(
  lazy(() => import('./pokemon-demo')),
  {
    type: 'Pokemon Demo',
    label: 'Custom / Pokémon Demo',
    props: {
      className: Style(),
      pokemon: Combobox({
        label: 'Pokémon',
        getOptions: async (query) => {
          const ctx = unstable_getControlContext()
          console.log({ ctx })
          const list = await loadPokemonList()
          const q = query.toLowerCase()
          return list
            .filter((p) => p.name.includes(q))
            .slice(0, MAX_COMBOBOX_RESULTS)
            .map((p) => ({ id: p.name, value: p, label: p.name }))
        },
      }),
      sprite: unstable_Gallery({
        label: 'Sprite',
        getOptions: async () => {
          // Read the sibling `pokemon` selection synchronously, BEFORE the first
          // `await` — the ambient context slot is restored once this function
          // yields (see message-port/control-context.ts).
          const ctx = unstable_getControlContext()
          const name = (ctx.pokemon as { value?: Pokemon } | undefined)?.value
            ?.name
          if (name == null) return { options: [] }

          try {
            const res = await fetch(`${POKEAPI}/pokemon/${name}`)
            const data: { sprites: PokemonSprites } = await res.json()
            return { options: spriteOptions(data.sprites) }
          } catch {
            return { options: [] }
          }
        },
      }),
    },
  },
)
